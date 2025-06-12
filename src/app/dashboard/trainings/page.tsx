import { getTrainings } from "@/features/trainings/actions";
import { TrainingsTable } from "@/features/trainings/components/trainings-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getUserClusterId } from "@/features/auth/actions";

export default async function TrainingsPage() {
  const clusterId = await getUserClusterId();

  if (!clusterId) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-muted-foreground">No cluster assigned</p>
      </div>
    );
  }

  const { data: trainings, error } = await getTrainings(clusterId);

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  if (!trainings || trainings.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Trainings</h1>
          <Button asChild>
            <Link href="/dashboard/trainings/new">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Add Training</span>
            </Link>
          </Button>
        </div>
        <div className="flex justify-center items-center h-[40vh]">
          <p className="text-muted-foreground">No trainings found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Trainings</h1>
        <Button asChild>
          <Link href="/dashboard/trainings/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Add Training</span>
          </Link>
        </Button>
      </div>
      <TrainingsTable data={trainings} />
    </div>
  );
}
