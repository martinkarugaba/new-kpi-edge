"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ReusableDataTable } from "@/components/ui/reusable-data-table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Project } from "@/features/projects/types";
import { ParticipantForm } from "./participant-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Participant } from "../types";
import { type ParticipantFormValues } from "./participant-form";

interface ParticipantsTableProps {
  data: Participant[];
  onEdit: (participant: Participant) => void;
  onDelete: (participant: Participant) => void;
  onAdd: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingParticipant: Participant | null;
  handleSubmit: (data: ParticipantFormValues) => Promise<void>;
  isLoading: boolean;
  projects: Project[];
}

export function ParticipantsTable({
  data,
  onEdit,
  onDelete,
  isOpen,
  setIsOpen,
  editingParticipant,
  handleSubmit,
  isLoading,
  projects,
}: ParticipantsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Participant[]>([]);

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) return;
    // Implement bulk delete functionality
    selectedRows.forEach((participant) => onDelete(participant));
    setSelectedRows([]);
  };

  const columns: ColumnDef<Participant>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value: boolean) =>
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
            onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      enableHiding: true,
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      enableHiding: true,
    },
    {
      accessorKey: "sex",
      header: "Sex",
      enableHiding: true,
    },
    {
      accessorKey: "age",
      header: "Age",
      enableHiding: true,
    },
    {
      accessorKey: "district",
      header: "District",
      enableHiding: true,
    },
    {
      accessorKey: "designation",
      header: "Designation",
      enableHiding: true,
    },
    {
      accessorKey: "enterprise",
      header: "Enterprise",
      enableHiding: true,
    },
    {
      accessorKey: "contact",
      header: "Contact",
      enableHiding: true,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
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

  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="flex items-center gap-2"
          >
            <Trash className="h-4 w-4" />
            Delete Selected ({selectedRows.length})
          </Button>
        </div>
      )}
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <ReusableDataTable
          columns={columns}
          data={data}
          filterColumn="firstName"
          filterPlaceholder="Filter by first name..."
          showColumnToggle={true}
          showPagination={true}
          showRowSelection={true}
          pageSize={10}
          onRowSelectionChange={setSelectedRows}
          customActions={
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">Add Participant</span>
                  <span className="lg:hidden">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingParticipant
                      ? "Edit Participant"
                      : "Add Participant"}
                  </DialogTitle>
                </DialogHeader>
                <ParticipantForm
                  initialData={
                    editingParticipant
                      ? {
                          ...editingParticipant,
                          age: editingParticipant.age.toString(),
                          sex: editingParticipant.sex as
                            | "male"
                            | "female"
                            | "other",
                          isPWD: editingParticipant.isPWD as "yes" | "no",
                          isMother: editingParticipant.isMother as "yes" | "no",
                          isRefugee: editingParticipant.isRefugee as
                            | "yes"
                            | "no",
                        }
                      : undefined
                  }
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  projects={projects}
                />
              </DialogContent>
            </Dialog>
          }
          customFilters={
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
          }
        />
      </div>
    </div>
  );
}
