import { auth } from "@/features/auth/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar variant="sidebar" collapsible="offcanvas" />
        <div className="flex-1">
          <main className="container flex-1 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
