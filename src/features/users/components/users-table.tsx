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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import { updateUser } from "../actions/users";
// import { userRole } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface UsersTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

// Component for handling role selection
// function RoleSelect({ user }: { user: User }) {
//   const [isPending, startTransition] = React.useTransition();

//   const handleRoleChange = async (
//     newRole: (typeof userRole.enumValues)[number]
//   ) => {
//     startTransition(async () => {
//       try {
//         const result = await updateUser(user.id, { role: newRole });
//         if (!result) {
//           toast.error("Failed to update user role");
//         } else {
//           toast.success("Role updated successfully");
//         }
//       } catch {
//         toast.error("Error updating user role");
//       }
//     });
//   };

//   return (
//     <Select
//       value={user.role}
//       onValueChange={handleRoleChange}
//       disabled={isPending}
//     >
//       <SelectTrigger className="w-40">
//         <SelectValue placeholder="Select role" />
//       </SelectTrigger>
//       <SelectContent>
//         {userRole.enumValues.map((role) => (
//           <SelectItem key={role} value={role}>
//             {role
//               .split("_")
//               .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//               .join(" ")}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   );
// }

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const [selectedRows, setSelectedRows] = useState<User[]>([]);

  const handleEdit = (user: User) => {
    if (onEdit) {
      onEdit(user);
    }
  };

  const handleDelete = (user: User) => {
    if (onDelete) {
      onDelete(user);
    }
  };

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
        const role = row.original.role;
        return (
          <Badge variant="outline" className="capitalize">
            {role.replace(/_/g, " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at);
        return date.toLocaleDateString();
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
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(user)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
          data={users}
          filterColumn="email"
          filterPlaceholder="Filter by email..."
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
