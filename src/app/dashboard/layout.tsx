import { auth } from "@/features/auth/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
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
      <div className="flex w-full min-h-screen rounded-2xl">
        <AppSidebar variant="sidebar" collapsible="icon" />
        <div className="rounded-2xl overflow-hidden bg-black border-white  relative flex-1 w-full transition-[margin] duration-200 ease-linear group-data-[state=expanded]:ml-64 group-data-[state=collapsed]:ml-0">
          <main className="flex-1 p-3 border-sidebar-accent pt-0 px-4 ">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
