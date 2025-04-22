import { notFound } from "next/navigation";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { ClusterDetails } from "@/features/clusters/components/cluster-details";
import { getClusterById } from "@/features/clusters/actions/clusters";

export default async function ClusterDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await the params promise to get the id
  const { id } = await params;
  const result = await getClusterById(id);

  if (!result.success || !result.data) {
    return notFound();
  }

  // Ensure createdAt and updatedAt are Date objects (not null)
  const clusterWithValidDates = {
    ...result.data,
    createdAt: result.data.createdAt || new Date(),
    updatedAt: result.data.updatedAt || new Date(),
  };

  return (
    <>
      <SiteHeader title={result.data.name}>
        <h2 className="text-sm text-muted-foreground">
          Manage cluster details and members
        </h2>
      </SiteHeader>
      <ClusterDetails cluster={clusterWithValidDates} />
    </>
  );
}
