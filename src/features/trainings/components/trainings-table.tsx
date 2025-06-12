import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Training } from "../types/types";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TrainingsTableProps {
  data: Training[];
}

export function TrainingsTable({ data }: TrainingsTableProps) {
  const columns: ColumnDef<Training>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link href={`/dashboard/trainings/${row.original.id}`}>
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "venue",
      header: "Venue",
    },
    {
      accessorKey: "trainingDate",
      header: "Date",
      cell: ({ row }) => format(new Date(row.getValue("trainingDate")), "PPP"),
    },
    {
      accessorKey: "numberOfParticipants",
      header: "Participants",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "completed"
                ? "default"
                : status === "pending"
                  ? "secondary"
                  : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button asChild size="sm">
          <Link href={`/dashboard/trainings/${row.original.id}`}>View</Link>
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trainings</CardTitle>
        <CardDescription>
          A list of all trainings in your cluster
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
