import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/ui/data-table";
import { MetricCards } from "@/components/ui/metric-cards";
import { SiteHeader } from "@/components/site-header";
// import { chartData } from "../data/chart-data"

export default async function ProjectsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <>
      <SiteHeader title="Projects" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <MetricCards />
            {/* <div className="px-4 lg:px-6">
              <ChartAreaInteractive data={chartData} />
            </div> */}
            {/* <DataTable data={[]} /> */}
          </div>
        </div>
      </div>
    </>
  );
}
