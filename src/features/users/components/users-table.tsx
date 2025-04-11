"use client";

import { Button } from "@/components/ui/button";
import { ReusableDataTable } from "@/components/ui/reusable-data-table";
import { User } from "../types";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface UsersTableProps {
  users: User[];
}

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <div className="capitalize">{role}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return format(new Date(date), "MMM d, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

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
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function UsersTable({ users }: UsersTableProps) {
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

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
          data={users}
          filterColumn="name"
          filterPlaceholder="Filter by name..."
          showColumnToggle={true}
          showPagination={true}
          showRowSelection={true}
          pageSize={10}
          onRowSelectionChange={setSelectedRows}
        />
      </div>
    </div>
  );
}
