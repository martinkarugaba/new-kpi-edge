import { getUsers } from "@/features/users/actions/users";
import { UsersTable } from "@/features/users/components/UsersTable";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default async function UsersPage() {
  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const result = await getUsers();

  if (!result.success) {
    return (
      <div className="container py-6 space-y-6">
        <div className="mx-auto max-w-7xl">
          <Card>
            <CardContent className="pt-6">
              <p className="text-destructive">
                Error loading users: {result.error}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <SiteHeader title="Users" />
      <div className="container py-6 space-y-6">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight">Users</h2>
                <p className="text-muted-foreground">
                  Manage users and their access to the system.
                </p>
              </div>
            </div>

            <div className="rounded-md border">
              <UsersTable users={result.data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
