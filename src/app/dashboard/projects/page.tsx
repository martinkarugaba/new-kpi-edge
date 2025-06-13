import { SiteHeader } from "@/features/dashboard/components/site-header";
import { ProjectsTable } from "@/features/projects/components/projects-table";
import { Card, CardContent } from "@/components/ui/card";
import { getProjects } from "@/features/projects/actions/projects";
import { getClusters } from "@/features/clusters/actions/clusters";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function ProjectsTableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}

export default async function Page() {
  const organizationId = "default-organization-id"; // Replace with actual logic to fetch organizationId
  const clustersResult = await getClusters();
  const projectsResult = await getProjects(organizationId);

  return (
    <>
      <SiteHeader title="Projects" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {!clustersResult.success || !projectsResult.success ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-destructive">
                    {!clustersResult.success && clustersResult.error && (
                      <span>
                        Error loading clusters: {clustersResult.error}
                      </span>
                    )}
                    {!projectsResult.success && projectsResult.error && (
                      <span>
                        Error loading projects: {projectsResult.error}
                      </span>
                    )}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Suspense fallback={<ProjectsTableSkeleton />}>
                <ProjectsTable
                  clusters={clustersResult.data || []}
                  projects={projectsResult.data || []}
                />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
