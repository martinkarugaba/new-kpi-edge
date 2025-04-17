"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ParticipantTableFilters() {
  return (
    <Select defaultValue="all">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select view" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Participants</SelectItem>
        <SelectItem value="active">Active Participants</SelectItem>
        <SelectItem value="by-district">By District</SelectItem>
      </SelectContent>
    </Select>
  );
}
