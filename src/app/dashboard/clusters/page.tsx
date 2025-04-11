import { Suspense } from "react";
import { ClustersTable } from "@/features/clusters/components/clusters-table";
import { ClusterMetrics } from "@/features/clusters/components/cluster-metrics";
import { getClusters } from "@/features/clusters/actions/clusters";
import { getOrganizations } from "@/features/organizations/actions/organizations";
import { getProjects } from "@/features/projects/actions/projects";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";

export default async function ClustersPage() {
  const [clustersResult, organizationsResult, projectsResult] =
    await Promise.all([getClusters(), getOrganizations(), getProjects()]);

  // Ensure we have valid data arrays, defaulting to empty arrays if the result is not successful
  const clusters = clustersResult.success ? clustersResult.data : [];
  const organizations = organizationsResult.success
    ? (organizationsResult.data ?? [])
    : [];
  const projects = projectsResult.success ? (projectsResult.data ?? []) : [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SiteHeader title="Clusters" />

          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-[120px] w-full" />
                ))}
              </div>
            }
          >
            <ClusterMetrics
              clusters={clusters}
              organizations={organizations}
              projects={projects}
            />
          </Suspense>

          <div className="px-4 lg:px-6">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-[400px] w-full" />
                </div>
              }
            >
              <ClustersTable data={clusters} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
