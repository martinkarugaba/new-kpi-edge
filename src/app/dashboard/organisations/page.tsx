import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function OrganisationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Organisations</h1>
      </div>
      <div className="rounded-lg border p-4">
        <p className="text-muted-foreground">
          Your organisations will appear here.
        </p>
      </div>
    </div>
  );
}
