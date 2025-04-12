import { auth } from "@/features/auth/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "@/features/dashboard/components/DashboardNav";
import { UserNav } from "@/features/dashboard/components/UserNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <DashboardNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={session.user} />
          </div>
        </div>
      </header>
      <div className="container flex-1">{children}</div>
    </div>
  );
}
