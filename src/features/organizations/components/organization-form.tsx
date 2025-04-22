"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Cluster } from "@/features/clusters/types";
import { Project } from "@/features/projects/types";
import { getProjects } from "@/features/projects/actions/projects";
import { MultiClusterSelect } from "@/features/clusters/components/multi-cluster-select";
import {
  createOrganizationWithClusters,
  updateOrganizationWithClusters,
} from "../actions/organization-with-clusters";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  acronym: z.string().min(1, "Acronym is required"),
  cluster_id: z.string().nullable(), // Keep for backward compatibility
  selected_cluster_ids: z.array(z.string()), // New field for multiple clusters
  project_id: z.string().nullable(),
  country: z.string().min(1, "Country is required"),
  district: z.string().min(1, "District is required"),
  sub_county: z.string().min(1, "Sub-county is required"),
  parish: z.string().min(1, "Parish is required"),
  village: z.string().min(1, "Village is required"),
  address: z.string().min(1, "Address is required"),
});

type FormValues = z.infer<typeof formSchema>;

type OrganizationFormProps = {
  initialData?: {
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
  };
  clusters: Cluster[];
  defaultClusterId?: string;
  onSuccess?: () => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
};

export function OrganizationForm({
  initialData,
  clusters,
  defaultClusterId,
  onSuccess,
  isLoading = false,
  setIsLoading,
}: OrganizationFormProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClusterIds, setSelectedClusterIds] = useState<string[]>(
    defaultClusterId ? [defaultClusterId] : [],
  );

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      const result = await getProjects();
      if (result.success && result.data) {
        setProjects(result.data || []);
      } else {
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // If initialData has a cluster_id, add it to selectedClusterIds on mount
  useEffect(() => {
    if (initialData?.cluster_id) {
      setSelectedClusterIds((prev) =>
        prev.includes(initialData.cluster_id as string)
          ? prev
          : [...prev, initialData.cluster_id as string],
      );
    }
  }, [initialData]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      acronym: initialData?.acronym || "",
      cluster_id: initialData?.cluster_id || defaultClusterId || null,
      selected_cluster_ids: selectedClusterIds,
      project_id: initialData?.project_id || null,
      country: initialData?.country || "",
      district: initialData?.district || "",
      sub_county: initialData?.sub_county || "",
      parish: initialData?.parish || "",
      village: initialData?.village || "",
      address: initialData?.address || "",
    },
  });

  // Update form when selectedClusterIds changes
  useEffect(() => {
    form.setValue("selected_cluster_ids", selectedClusterIds);
  }, [selectedClusterIds, form]);

  async function onSubmit(data: FormValues) {
    if (setIsLoading) setIsLoading(true);

    try {
      if (initialData) {
        // Update existing organization with clusters
        const result = await updateOrganizationWithClusters(
          initialData.id,
          data,
          selectedClusterIds,
        );

        if (!result.success) throw new Error(result.error);
        toast.success("Organization updated successfully");
      } else {
        // Create new organization with clusters
        const result = await createOrganizationWithClusters(
          data,
          selectedClusterIds,
        );

        if (!result.success) throw new Error(result.error);
        toast.success("Organization created successfully");
      }

      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter organization name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="acronym"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acronym</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter organization acronym"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cluster selection */}
            <div className="space-y-2">
              <FormLabel>Clusters</FormLabel>
              <MultiClusterSelect
                clusters={clusters}
                selectedClusterIds={selectedClusterIds}
                onChange={setSelectedClusterIds}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                Select one or more clusters this organization belongs to
              </p>
            </div>

            {/* Hidden field for backward compatibility */}
            <div className="hidden">
              <FormField
                control={form.control}
                name="cluster_id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <input
                        type="hidden"
                        {...field}
                        value={selectedClusterIds[0] || ""}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Project selection */}
            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
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
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter country"
                        {...field}
                        disabled={isLoading}
                      />
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
                      <Input
                        placeholder="Enter district"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sub_county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub County</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter sub-county"
                        {...field}
                        disabled={isLoading}
                      />
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
                      <Input
                        placeholder="Enter parish"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="village"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Village</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter village"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Address Information</h3>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter address"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-4 border-gray-200">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 py-3 w-full cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : initialData ? (
                "Update Organization"
              ) : (
                "Create Organization"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
