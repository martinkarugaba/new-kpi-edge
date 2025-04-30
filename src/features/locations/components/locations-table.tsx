"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ReusableDataTable } from "@/components/ui/reusable-data-table";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface Location {
  id: string;
  name: string;
  type: string;
  district: string;
  subCounty: string;
  parish: string;
  village: string;
}

interface LocationsTableProps {
  locations: Location[];
}

function ActionsCell({ location }: { location: Location }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions for {location.name}</DropdownMenuLabel>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LocationsTable({ locations }: LocationsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Location[]>([]);

  const columns: ColumnDef<Location>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      enableHiding: true,
    },
    {
      accessorKey: "type",
      header: "Type",
      enableHiding: true,
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "district",
      header: "District",
      enableHiding: true,
    },
    {
      accessorKey: "subCounty",
      header: "Sub County",
      enableHiding: true,
    },
    {
      accessorKey: "parish",
      header: "Parish",
      enableHiding: true,
    },
    {
      accessorKey: "village",
      header: "Village",
      enableHiding: true,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => <ActionsCell location={row.original} />,
    },
  ];

  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Selected ({selectedRows.length})
          </Button>
        </div>
      )}
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <ReusableDataTable
          columns={columns}
          data={locations}
          filterColumn="name"
          filterPlaceholder="Filter by name..."
          showColumnToggle={true}
          showPagination={true}
          showRowSelection={true}
          pageSize={10}
          onRowSelectionChange={setSelectedRows}
          customActions={
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Add Location</span>
              <span className="lg:hidden">Add</span>
            </Button>
          }
        />
      </div>
    </div>
  );
}
