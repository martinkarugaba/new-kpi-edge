"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TableFilters() {
  return (
    <Select defaultValue="all">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select view" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Organizations</SelectItem>
        <SelectItem value="active">Active Organizations</SelectItem>
        <SelectItem value="by-cluster">By Cluster</SelectItem>
      </SelectContent>
    </Select>
  );
}
