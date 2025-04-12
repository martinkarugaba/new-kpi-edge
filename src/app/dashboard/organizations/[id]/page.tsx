import { notFound, redirect } from "next/navigation";
import { getOrganization } from "@/features/organizations/actions/organizations";
import { getOrganizationMembers } from "@/features/organizations/actions/organization-members";
import { OrganizationMembers } from "@/features/organizations/components/OrganizationMembers";
import { auth } from "@/auth";
import { SiteHeader } from "@/features/dashboard/components/site-header";

interface OrganizationDetailsPageProps {
  params: {
    id: string;
  };
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default async function OrganizationDetailsPage({
  params,
}: OrganizationDetailsPageProps) {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  // Get the organization ID from params - we need to await params
  const { id } = await Promise.resolve(params);
  if (!id) {
    notFound();
  }

  const organizationResult = await getOrganization(id);
  const membersResult = await getOrganizationMembers(id);

  if (!organizationResult.success) {
    notFound();
  }

  const organization = organizationResult.data!;

  return (
    <>
      <SiteHeader title={organization?.name} />
      <div className="container py-6 space-y-6">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Organization Details
                </h2>
                <p className="text-muted-foreground">
                  View and manage organization details and members.
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center">
                        <span className="font-medium">Name:</span>
                        <span className="col-span-2">{organization.name}</span>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <span className="font-medium">Acronym:</span>
                        <span className="col-span-2">
                          {organization.acronym}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <span className="font-medium">Country:</span>
                        <span className="col-span-2">
                          {organization.country}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <span className="font-medium">District:</span>
                        <span className="col-span-2">
                          {organization.district}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Location Details</h3>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center">
                        <span className="font-medium">Sub-county:</span>
                        <span className="col-span-2">
                          {organization.sub_county}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <span className="font-medium">Parish:</span>
                        <span className="col-span-2">
                          {organization.parish}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <span className="font-medium">Village:</span>
                        <span className="col-span-2">
                          {organization.village}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <span className="font-medium">Address:</span>
                        <span className="col-span-2">
                          {organization.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <OrganizationMembers
                organizationId={organization.id}
                members={
                  membersResult.success && membersResult.data
                    ? membersResult.data
                        .filter(
                          (member: Member | null): member is Member =>
                            member !== null,
                        )
                        .map((member: Member) => ({
                          id: member.id,
                          name: member.name,
                          email: member.email,
                          role: member.role,
                          createdAt: member.createdAt,
                          updatedAt: member.updatedAt,
                        }))
                    : []
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
