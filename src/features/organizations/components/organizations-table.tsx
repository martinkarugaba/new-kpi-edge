/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { Button } from "@/components/ui/button";
import { Organization } from "@/features/organizations/types";
import { CreateOrganizationDialog } from "./create-organization-dialog";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cluster } from "@/features/clusters/components/clusters-table";
import { ReusableDataTable } from "@/components/ui/reusable-data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditOrganizationDialog } from "./edit-organization-dialog";
import { DeleteOrganizationDialog } from "./delete-organization-dialog";

interface OrganizationsTableProps {
  organizations: Organization[];
  clusters: Cluster[];
}

// Create a separate component for the actions cell
function ActionsCell({
  organization,
  clusters,
  onSelectOrganization,
}: {
  organization: Organization;
  clusters: Cluster[];
  onSelectOrganization: (org: Organization | null) => void;
}) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditOrganizationDialog
        organization={organization}
        clusters={clusters}
        onSelect={() => {
          setShowEditDialog(false);
          onSelectOrganization(organization);
        }}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeleteOrganizationDialog
        organization={organization}
        onDelete={() => {
          setShowDeleteDialog(false);
          onSelectOrganization(null);
        }}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}

export function OrganizationsTable({
  organizations,
  clusters,
}: OrganizationsTableProps) {
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

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
      accessorKey: "acronym",
      header: "Acronym",
      enableHiding: true,
    },
    {
      id: "cluster",
      header: "Cluster",
      enableHiding: true,
      cell: ({ row }) => {
        const organization = row.original;
        return organization.cluster ? (
          <Badge variant="outline">{organization.cluster.name}</Badge>
        ) : (
          <span className="text-muted-foreground">No cluster</span>
        );
      },
    },
    {
      accessorKey: "project",
      header: "Project",
      enableHiding: true,
      cell: ({ row }) => row.original.project || "-",
    },
    {
      id: "location",
      header: "Location",
      enableHiding: true,
      cell: ({ row }) => {
        const organization = row.original;
        return <div>{organization.district}</div>;
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      enableHiding: true,
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const organization = row.original;
        return (
          <ActionsCell
            organization={organization}
            clusters={clusters}
            onSelectOrganization={setSelectedOrganization}
          />
        );
      },
    },
  ];

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <ReusableDataTable
          columns={columns}
          data={organizations}
          filterColumn="name"
          filterPlaceholder="Filter by name..."
          showColumnToggle={true}
          showPagination={true}
          showRowSelection={true}
          pageSize={10}
          customActions={
            <CreateOrganizationDialog clusters={clusters}>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden lg:inline">Add Organization</span>
                <span className="lg:hidden">Add</span>
              </Button>
            </CreateOrganizationDialog>
          }
          customFilters={
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
          }
        />
      </div>
    </div>
  );
}
