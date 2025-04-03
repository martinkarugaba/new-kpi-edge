import { getOrganizations } from "@/features/organizations/actions/organizations";
import { getClusters } from "@/features/clusters/actions/clusters";
import { OrganizationsTable } from "@/features/organizations/components/organizations-table";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";

export default async function OrganizationsPage() {
  const clustersResult = await getClusters();
  const organizationsResult = await getOrganizations();

  if (!clustersResult.success || !organizationsResult.success) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Failed to load data</p>
      </div>
    );
  }

  const clusters = clustersResult.data;
  const organizations = organizationsResult.data || [];

  return (
    <>
      <SiteHeader title="Organisations" />
      <Suspense fallback={<OrganizationsTableSkeleton />}>
        <div className="container py-6 space-y-6">
          <div className="mx-auto max-w-7xl">
            <OrganizationsTable
              organizations={organizations}
              clusters={clusters}
            />
          </div>
        </div>
      </Suspense>
    </>
  );
}

function OrganizationsTableSkeleton() {
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
