"use client";

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
import { useOrganizationForm } from "./form-context/form-provider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function BasicInfoForm() {
  const {
    form,
    projects,
    clusters,
    selectedClusterIds,
    setSelectedClusterIds,
    isLoading,
  } = useOrganizationForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Enter general information about this organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Organization Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter organization name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Organization Acronym */}
        <FormField
          control={form.control}
          name="acronym"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acronym</FormLabel>
              <FormControl>
                <Input placeholder="Enter acronym" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cluster Select */}
        <FormField
          control={form.control}
          name="selected_cluster_ids"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Clusters</FormLabel>
              <MultiClusterSelect
                clusters={clusters}
                selectedClusterIds={selectedClusterIds}
                onChange={setSelectedClusterIds}
                disabled={isLoading}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Project Select */}
        <FormField
          control={form.control}
          name="project_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Project</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value || "none"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
