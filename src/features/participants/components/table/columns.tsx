"use client";

import { type ColumnDef, type Table, type Row } from "@tanstack/react-table";
import { type Participant } from "../../types/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionCell } from "./action-cell";

interface GetColumnsProps {
  onEdit: (participant: Participant) => void;
  onDelete: (participant: Participant) => void;
}

export function getColumns({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<Participant>[] {
  return [
    {
      id: "select",
      header: ({ table }: { table: Table<Participant> }) => (
        <div className="flex items-center justify-center px-4">
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
      cell: ({ row }: { row: Row<Participant> }) => (
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
      id: "fullName",
      header: "Name",
      enableHiding: true,
      accessorFn: row => `${row.firstName} ${row.lastName}`, // This enables sorting and filtering
      cell: ({ row }) => (
        <div>
          {row.original.firstName} {row.original.lastName}
        </div>
      ),
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
      id: "district",
      header: "District",
      enableHiding: true,
      accessorFn: row => row.districtName || row.district,
      cell: ({ row }) => {
        const displayValue = row.original.districtName || row.original.district;
        return (
          <div className="max-w-[200px] truncate" title={displayValue}>
            {displayValue}
          </div>
        );
      },
    },
    {
      id: "subCounty",
      header: "Sub County",
      enableHiding: true,
      accessorFn: row => row.subCountyName || row.subCounty,
      cell: ({ row }) => {
        const displayValue =
          row.original.subCountyName || row.original.subCounty;
        return (
          <div className="max-w-[200px] truncate" title={displayValue}>
            {displayValue}
          </div>
        );
      },
    },
    {
      id: "country",
      header: "Country",
      enableHiding: true,
      accessorFn: row => row.countyName || row.country || "",
      cell: ({ row }) => {
        const displayValue =
          row.original.countyName || row.original.country || "—";
        return (
          <div className="max-w-[200px] truncate" title={displayValue}>
            {displayValue}
          </div>
        );
      },
    },
    {
      id: "organization",
      header: "Organization",
      enableHiding: true,
      accessorFn: row => row.organizationName || row.organization_id,
      cell: ({ row }) => {
        const displayValue =
          row.original.organizationName || row.original.organization_id;
        return (
          <div className="max-w-[200px] truncate" title={displayValue}>
            {displayValue}
          </div>
        );
      },
    },
    {
      id: "project",
      header: "Project",
      enableHiding: true,
      accessorFn: row => row.projectName || "Unknown",
      cell: ({ row }) => {
        const displayValue = row.original.projectName || "Unknown";
        return (
          <div className="max-w-[200px] truncate" title={displayValue}>
            {displayValue}
          </div>
        );
      },
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
      cell: ({ row }) => (
        <ActionCell
          participant={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
