import { ColumnDef } from "@tanstack/react-table";
import { Organization } from "../types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Cluster } from "@/features/clusters/components/clusters-table";
import { ActionsCell } from "./organization-table-actions";

interface OrganizationTableColumnsProps {
  clusters: Cluster[];
  onSelectOrganization: (org: Organization | null) => void;
}

export function getOrganizationTableColumns({
  clusters,
  onSelectOrganization,
}: OrganizationTableColumnsProps): ColumnDef<Organization>[] {
  return [
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
      id: "project",
      header: "Project",
      enableHiding: true,
      cell: ({ row }) => {
        const organization = row.original;
        return organization.project ? (
          <Badge variant="outline">{organization.project.name}</Badge>
        ) : (
          <span className="text-muted-foreground">No project</span>
        );
      },
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
            onSelectOrganization={onSelectOrganization}
          />
        );
      },
    },
  ];
}
