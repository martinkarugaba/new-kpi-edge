import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getClusters } from "@/features/clusters/actions/clusters";
import { SiteHeader } from "@/components/site-header";
import {
  ClustersTable,
  Cluster,
} from "@/features/clusters/components/clusters-table";
// import { chartData } from "../data/chart-data";

export default async function ClustersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clustersResult = await getClusters();
  const clusters: Cluster[] = clustersResult.success ? clustersResult.data : [];

  return (
    <>
      <SiteHeader title="Clusters" />
      <div className="container py-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Clusters</h1>
            <p className="text-muted-foreground">
              Manage your clusters and their locations
            </p>
          </div>
          <ClustersTable data={clusters} />
        </div>
      </div>
    </>
  );
}
