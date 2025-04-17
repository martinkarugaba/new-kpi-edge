import { SiteHeader } from "@/features/dashboard/components/site-header";
import { ParticipantsClient } from "@/features/participants/components/participants-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjects } from "@/features/projects/actions/projects";
import { getClusters } from "@/features/clusters/actions/clusters";
import { getOrganizationId, getUserClusterId } from "@/features/auth/actions";

function ParticipantsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}

export default async function Page() {
  const clusterId = await getUserClusterId();
  const organizationId = await getOrganizationId();
  const projectsResult = await getProjects();
  const clustersResult = await getClusters();

  if (!clusterId) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">No cluster assigned to user</p>
      </div>
    );
  }

  if (!projectsResult.success || !clustersResult.success) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-destructive">
          {!projectsResult.success
            ? projectsResult.error
            : clustersResult.error}
        </p>
      </div>
    );
  }

  return (
    <>
      <SiteHeader title="Participants" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <Suspense fallback={<ParticipantsTableSkeleton />}>
              <ParticipantsClient
                clusterId={clusterId}
                organizationId={organizationId ?? undefined}
                projects={projectsResult.data ?? []}
                clusters={clustersResult.data ?? []}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
