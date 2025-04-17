import { getProjects } from "@/features/projects/actions/projects";
import { ParticipantsClient } from "../components/participants-client";
import { getOrganizationId } from "@/features/auth/actions";

export default async function ParticipantsPage() {
  const organizationId = await getOrganizationId();
  const projectsResponse = await getProjects(organizationId || undefined);

  if (!projectsResponse.success) {
    throw new Error(projectsResponse.error);
  }

  return (
    <ParticipantsClient
      organizationId={organizationId ?? ""}
      projects={projectsResponse.data ?? []}
    />
  );
}
