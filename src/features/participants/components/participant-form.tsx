"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { type Project } from "@/features/projects/types";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationId } from "@/features/auth/actions";
import {
  getCurrentOrganizationWithCluster,
  getOrganizationsByCluster,
} from "@/features/organizations/actions/organizations";
import { getCurrentUserClusterOrganizations } from "@/features/clusters/actions/cluster-users";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  country: z.string().min(2, "Country is required"),
  district: z.string().min(2, "District is required"),
  subCounty: z.string().min(2, "Sub-county is required"),
  parish: z.string().min(2, "Parish is required"),
  village: z.string().min(2, "Village is required"),
  sex: z.enum(["male", "female", "other"]),
  age: z.string().min(1, "Age is required"),
  isPWD: z.enum(["yes", "no"]),
  isMother: z.enum(["yes", "no"]),
  isRefugee: z.enum(["yes", "no"]),
  noOfTrainings: z.string().min(1, "Number of trainings is required"),
  isActive: z.enum(["yes", "no"]),
  designation: z.string().min(2, "Designation is required"),
  enterprise: z.string().min(2, "Enterprise is required"),
  contact: z.string().min(10, "Contact must be at least 10 characters"),
  project_id: z.string().min(1, "Project is required"),
  organization_id: z.string().min(1, "Organization is required"),
});

export type ParticipantFormValues = z.infer<typeof formSchema>;

interface ParticipantFormProps {
  initialData?: ParticipantFormValues;
  onSubmit: (data: ParticipantFormValues) => Promise<void>;
  isLoading?: boolean;
  projects: Project[];
  clusterId?: string;
}

export function ParticipantForm({
  initialData,
  onSubmit,
  isLoading,
  projects,
  clusterId: propClusterId,
}: ParticipantFormProps) {
  const { data: organizationId } = useQuery({
    queryKey: ["organizationId"],
    queryFn: getOrganizationId,
  });

  // Add a local Organization type for use in this file
  interface Organization {
    id: string;
    name: string;
    acronym: string;
    cluster_id: string | null;
    project_id: string | null;
    country: string;
    district: string;
    sub_county: string;
    parish: string;
    village: string;
    address: string;
    created_at: Date | null;
    updated_at: Date | null;
    cluster: {
      id: string;
      name: string;
    } | null;
    project: {
      id: string;
      name: string;
      acronym: string;
    } | null;
  }

  // Add type for API response
  interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }

  const { data: organizationsData } = useQuery({
    queryKey: ["organizations", organizationId],
    queryFn: async () => {
      if (!organizationId) return null;

      // Fetch the current organization with its cluster
      const currentOrgResult =
        await getCurrentOrganizationWithCluster(organizationId);
      if (!currentOrgResult.success || !currentOrgResult.data) {
        console.error("Failed to fetch organization:", currentOrgResult.error);
        return null;
      }

      const currentOrg = currentOrgResult.data as Organization;

      // Fetch organizations from both sources
      let clusterOrgs: Organization[] = [];
      let userClusterOrgs: Organization[] = [];

      // Get organizations from the current org's cluster if it belongs to one
      if (currentOrg.cluster_id) {
        const orgsResult = (await getOrganizationsByCluster(
          currentOrg.cluster_id,
        )) as ApiResponse<Organization[]>;
        if (orgsResult.success && orgsResult.data) {
          clusterOrgs = orgsResult.data;
        }
      }

      // Get organizations from clusters the user belongs to
      const userOrgsResult =
        (await getCurrentUserClusterOrganizations()) as ApiResponse<
          Organization[]
        >;
      if (userOrgsResult.success && userOrgsResult.data) {
        userClusterOrgs = userOrgsResult.data;
      }

      // Combine and deduplicate organizations
      const availableOrgs: Organization[] = [...clusterOrgs];
      for (const org of userClusterOrgs) {
        if (!availableOrgs.find((existingOrg) => existingOrg.id === org.id)) {
          availableOrgs.push(org);
        }
      }
      if (!availableOrgs.find((org) => org.id === currentOrg.id)) {
        availableOrgs.push(currentOrg);
      }

      return {
        currentOrg,
        organizations: availableOrgs,
        currentClusterId: currentOrg.cluster_id || propClusterId,
      };
    },
    enabled: !!organizationId,
  });

  const form = useForm<ParticipantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      country: "",
      district: "",
      subCounty: "",
      parish: "",
      village: "",
      sex: "male",
      age: "",
      isPWD: "no",
      isMother: "no",
      isRefugee: "no",
      noOfTrainings: "0",
      isActive: "yes",
      designation: "",
      enterprise: "",
      contact: "",
      project_id: "",
      organization_id: "",
    },
  });

  const handleSubmit = async (data: ParticipantFormValues) => {
    try {
      await onSubmit(data);
      if (!initialData) {
        form.reset();
      }
      toast.success(
        initialData
          ? "Participant updated successfully"
          : "Participant created successfully",
      );
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="organization_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {organizationsData?.organizations &&
                    organizationsData.organizations.length > 0 ? (
                      organizationsData.organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.acronym || org.name}
                          {org.cluster?.name ? ` (${org.cluster.name})` : ""}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-2 px-2 text-sm text-muted-foreground">
                        No organizations available
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.acronym}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input placeholder="District" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subCounty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub County</FormLabel>
                <FormControl>
                  <Input placeholder="Sub County" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parish"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parish</FormLabel>
                <FormControl>
                  <Input placeholder="Parish" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="village"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Village</FormLabel>
                <FormControl>
                  <Input placeholder="Village" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Age" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isPWD"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Person with Disability</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isMother"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mother</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isRefugee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Refugee</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noOfTrainings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Trainings</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Number of trainings"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Active</SelectItem>
                    <SelectItem value="no">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Designation" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enterprise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enterprise</FormLabel>
                <FormControl>
                  <Input placeholder="Enterprise" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <FormControl>
                  <Input placeholder="Contact" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full text-center cursor-pointer"
          disabled={isLoading}
        >
          {isLoading
            ? "Loading..."
            : initialData
              ? "Update Participant"
              : "Add Participant"}
        </Button>
      </form>
    </Form>
  );
}
