import { getProjects } from "@/features/projects/actions/projects";
import { ParticipantsClient } from "./participants-client";
import { getOrganizationId, getUserClusterId } from "@/features/auth/actions";
import { getClusters } from "@/features/clusters/actions/clusters";

export default async function ParticipantsPage() {
  const organizationId = await getOrganizationId();
  const clusterId = await getUserClusterId();
  const projectsResponse = await getProjects(organizationId || undefined);
  const clustersResponse = await getClusters();

  if (!projectsResponse.success) {
    throw new Error(projectsResponse.error);
  }

  if (!clusterId) {
    throw new Error("No cluster assigned to user");
  }

  if (!clustersResponse.success) {
    throw new Error(clustersResponse.error);
  }

  return (
    <ParticipantsClient
      organizationId={organizationId ?? ""}
      projects={projectsResponse.data ?? []}
      clusterId={clusterId}
      clusters={clustersResponse.data ?? []}
    />
  );
}
