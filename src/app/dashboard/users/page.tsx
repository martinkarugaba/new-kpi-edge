import { SiteHeader } from "@/components/site-header";
import { UsersTable } from "@/features/users/components/users-table";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUsers } from "@/features/users/actions/users";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  try {
    const usersResult = await getUsers();

    if (!usersResult.success) {
      throw new Error(usersResult.error || "Failed to fetch users");
    }

    return (
      <>
        <SiteHeader title="Users" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <UsersTable users={usersResult.data} />
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    return (
      <>
        <SiteHeader title="Users" />
        <div className="container py-6 space-y-6">
          <div className="mx-auto max-w-7xl">
            <Card>
              <CardContent className="pt-6">
                <p className="text-destructive">
                  Error loading users data:{" "}
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
