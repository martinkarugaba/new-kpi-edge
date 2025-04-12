import { SiteHeader } from "@/components/site-header";
import { ClustersTable } from "@/features/clusters/components/clusters-table";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getClusters } from "@/features/clusters/actions/clusters";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  try {
    const clustersResult = await getClusters();

    if (!clustersResult.success) {
      throw new Error(clustersResult.error || "Failed to fetch clusters");
    }

    return (
      <>
        <SiteHeader title="Clusters" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <ClustersTable data={clustersResult.data} />
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    return (
      <>
        <SiteHeader title="Clusters" />
        <div className="container py-6 space-y-6">
          <div className="mx-auto max-w-7xl">
            <Card>
              <CardContent className="pt-6">
                <p className="text-destructive">
                  Error loading clusters data:{" "}
                  {error instanceof Error
                    ? error.message
                    : "Unknown error occurred"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }
}
