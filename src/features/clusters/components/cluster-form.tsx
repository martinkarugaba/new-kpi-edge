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
import { createCluster, updateCluster } from "../actions/clusters";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  about: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  districts: z.string().min(1, "At least one district is required"),
});

type FormValues = z.infer<typeof formSchema>;

type ClusterFormProps = {
  initialData?: {
    id: string;
    name: string;
    about: string | null;
    country: string;
    districts: string[];
  };
  onSuccess?: () => void;
};

export function ClusterForm({ initialData, onSuccess }: ClusterFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      about: initialData?.about || "",
      country: initialData?.country || "",
      districts: initialData?.districts.join(", ") || "",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const clusterData = {
        ...data,
        districts: data.districts.split(",").map((d) => d.trim()),
      };

      if (initialData) {
        const result = await updateCluster({
          id: initialData.id,
          ...clusterData,
        });
        if (!result.success) throw new Error(result.error);
        toast.success("Cluster updated successfully");
      } else {
        const result = await createCluster(clusterData);
        if (!result.success) throw new Error(result.error);
        toast.success("Cluster created successfully");
      }

      router.refresh();
      onSuccess?.();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Cluster name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about this cluster"
                  className="resize-none"
                  {...field}
                />
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
          name="districts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Districts</FormLabel>
              <FormControl>
                <Input
                  placeholder="District 1, District 2, District 3"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {initialData ? "Update Cluster" : "Create Cluster"}
        </Button>
      </form>
    </Form>
  );
}
