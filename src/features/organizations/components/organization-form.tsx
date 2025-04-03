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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  createOrganization,
  updateOrganization,
} from "../actions/organizations";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Cluster } from "@/features/clusters/components/clusters-table";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  acronym: z.string().min(1, "Acronym is required"),
  clusterId: z.string().nullable(),
  project: z.string().nullable(),
  country: z.string().min(1, "Country is required"),
  district: z.string().min(1, "District is required"),
  subCounty: z.string().min(1, "Sub-county is required"),
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
    clusterId: string | null;
    project: string | null;
    country: string;
    district: string;
    subCounty: string;
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
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      acronym: initialData?.acronym || "",
      clusterId: initialData?.clusterId || defaultClusterId || null,
      project: initialData?.project || null,
      country: initialData?.country || "",
      district: initialData?.district || "",
      subCounty: initialData?.subCounty || "",
      parish: initialData?.parish || "",
      village: initialData?.village || "",
      address: initialData?.address || "",
    },
  });

  async function onSubmit(data: FormValues) {
    if (setIsLoading) setIsLoading(true);

    try {
      if (initialData) {
        const result = await updateOrganization(initialData.id, data);
        if (!result.success) throw new Error(result.error);
        toast.success("Organization updated successfully");
      } else {
        const result = await createOrganization(data);
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

  const nextStep = () => {
    // Validate current step fields before proceeding
    const currentStepFields = getStepFields(step);
    const isValid = currentStepFields.every((field) => {
      const value = form.getValues(field);
      return value !== undefined && value !== null && value !== "";
    });

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      // Trigger validation for current step fields
      currentStepFields.forEach((field) => {
        form.trigger(field);
      });
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const getStepFields = (step: number): (keyof FormValues)[] => {
    switch (step) {
      case 1:
        return ["name", "acronym", "clusterId", "project"];
      case 2:
        return ["country", "district", "subCounty", "parish", "village"];
      case 3:
        return ["address"];
      default:
        return [];
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Progress indicator */}
          <div className="flex items-center justify-between mb-6">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step > index + 1
                      ? "bg-black text-white"
                      : step === index + 1
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-500",
                  )}
                >
                  {index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={cn(
                      "h-1 w-16 mx-2",
                      step > index + 1 ? "bg-black" : "bg-gray-200",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter organization name"
                          {...field}
                          disabled={isLoading}
                          className="h-12 text-base rounded-lg border-gray-300 focus:border-black focus:ring-black"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acronym"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Acronym
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter organization acronym"
                          {...field}
                          disabled={isLoading}
                          className="h-12 text-base rounded-lg border-gray-300 focus:border-black focus:ring-black"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clusterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Cluster
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 text-base rounded-lg border-gray-300 focus:border-black focus:ring-black">
                          <SelectValue placeholder="Select a cluster" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clusters.map((cluster) => (
                          <SelectItem key={cluster.id} value={cluster.id}>
                            {cluster.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Project
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter project name (optional)"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                        disabled={isLoading}
                        className="h-12 text-base rounded-lg border-gray-300 focus:border-black focus:ring-black"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 2: Location Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Location Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Country
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter country"
                          {...field}
                          disabled={isLoading}
                          className="h-12 text-base rounded-lg border-gray-300 focus:border-black focus:ring-black"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        District
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter district"
                          {...field}
                          disabled={isLoading}
                          className="h-12 text-base rounded-lg border-gray-300 focus:border-black focus:ring-black"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="subCounty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Sub-county
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter sub-county"
                          {...field}
                          disabled={isLoading}
                          className="h-12 text-base rounded-lg border-gray-300 focus:border-black focus:ring-black"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Parish
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter parish"
                          {...field}
                          disabled={isLoading}
                          className="h-12 text-base rounded-lg border-gray-300 focus:border-black focus:ring-black"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="village"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Village
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter village"
                        {...field}
                        disabled={isLoading}
                        className="h-12 text-base rounded-lg border-gray-300 focus:border-black focus:ring-black"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3: Address Information */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Address Information</h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter address"
                        {...field}
                        disabled={isLoading}
                        className="h-12 text-base rounded-lg border-gray-300 focus:border-black focus:ring-black"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-gray-200">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
                className="h-12 px-6 text-base font-medium rounded-lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
            )}
            <div className="ml-auto">
              {step < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isLoading}
                  className="h-12 px-6 text-base font-medium bg-black text-white hover:bg-gray-800 rounded-lg"
                >
                  Next
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-6 text-base font-medium bg-black text-white hover:bg-gray-800 rounded-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {initialData ? "Updating..." : "Creating..."}
                    </>
                  ) : initialData ? (
                    "Update Organization"
                  ) : (
                    "Create Organization"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
