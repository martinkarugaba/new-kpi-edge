"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReusableDataTable } from "@/components/ui/reusable-data-table";
import { Organization } from "../types";

// Define the columns for the organizations table
const columns: ColumnDef<Organization>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "acronym",
    header: "Acronym",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "district",
    header: "District",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const organization = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(organization.id)}
            >
              Copy organization ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit organization</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Delete organization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface OrganizationsTableExampleProps {
  data: Organization[];
  onRowSelectionChange?: (selectedOrganizations: Organization[]) => void;
}

export function OrganizationsTableExample({
  data,
  onRowSelectionChange,
}: OrganizationsTableExampleProps) {
  return (
    <ReusableDataTable
      columns={columns}
      data={data}
      filterColumn="name"
      filterPlaceholder="Filter by name..."
      showColumnToggle={true}
      showPagination={true}
      showRowSelection={true}
      pageSize={10}
      onRowSelectionChange={onRowSelectionChange}
    />
  );
}
