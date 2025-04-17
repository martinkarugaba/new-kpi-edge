"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ReusableDataTable } from "@/components/ui/reusable-data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Participant } from "../types";

interface ParticipantsTableProps {
  data: Participant[];
  onEdit: (participant: Participant) => void;
  onDelete: (participant: Participant) => void;
}

export function ParticipantsTable({
  data,
  onEdit,
  onDelete,
}: ParticipantsTableProps) {
  const columns: ColumnDef<Participant>[] = [
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "sex",
      header: "Sex",
    },
    {
      accessorKey: "age",
      header: "Age",
    },
    {
      accessorKey: "district",
      header: "District",
    },
    {
      accessorKey: "designation",
      header: "Designation",
    },
    {
      accessorKey: "enterprise",
      header: "Enterprise",
    },
    {
      accessorKey: "contact",
      header: "Contact",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const participant = row.original;

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
              <DropdownMenuItem onClick={() => onEdit(participant)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(participant)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <ReusableDataTable columns={columns} data={data} />;
}
