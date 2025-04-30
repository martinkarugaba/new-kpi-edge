import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { MultiClusterSelect } from "@/features/clusters/components/multi-cluster-select";
import { Cluster } from "@/features/clusters/types";
import { Project } from "@/features/projects/types";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types.js";

interface BasicInformationProps {
  form: UseFormReturn<FormValues>;
  projects: Project[];
  clusters: Cluster[];
  selectedClusterIds: string[];
  setSelectedClusterIds: (ids: string[]) => void;
  isLoading?: boolean;
}

export function BasicInformation({
  form,
  projects,
  clusters,
  selectedClusterIds,
  setSelectedClusterIds,
  isLoading = false,
}: BasicInformationProps) {
  return (
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
  );
}
