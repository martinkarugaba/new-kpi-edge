import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getProjects } from "@/features/projects/actions/projects";
import { ProjectsTable } from "@/features/projects/components/projects-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function ProjectsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const projectsResult = await getProjects();

  if (!projectsResult.success) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Failed to load data</p>
      </div>
    );
  }

  const projects = projectsResult.data || [];

  return (
    <>
      <SiteHeader title="Projects" />
      <Suspense fallback={<ProjectsTableSkeleton />}>
        <div className="container py-6 space-y-6">
          <div className="mx-auto max-w-7xl">
            <ProjectsTable projects={projects} />
          </div>
        </div>
      </Suspense>
    </>
  );
}

function ProjectsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="border rounded-lg">
        <div className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
