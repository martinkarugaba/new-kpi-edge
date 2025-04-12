"use client";

import * as React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { updateUser } from "../actions/users";

interface UsersTableProps {
  users: User[];
}

// Component for handling role selection
function RoleSelect({ user }: { user: User }) {
  const [isPending, startTransition] = React.useTransition();

  const handleRoleChange = async (newRole: string) => {
    startTransition(async () => {
      try {
        const result = await updateUser(user.id, { role: newRole });
        if (!result) {
          toast.error("Failed to update user role");
        } else {
          toast.success("Role updated successfully");
        }
      } catch {
        toast.error("Error updating user role");
      }
    });
  };

  return (
    <Select
      value={user.role}
      onValueChange={handleRoleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="manager">Manager</SelectItem>
      </SelectContent>
    </Select>
  );
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
      const user = row.original;
      return <RoleSelect user={user} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      // Handle both ISO string and timestamp formats
      const parsedDate = date ? new Date(date) : null;
      return parsedDate && !isNaN(parsedDate.getTime())
        ? format(parsedDate, "MMM d, yyyy")
        : "Invalid date";
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
