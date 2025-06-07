"use client";

import { Loader2, LayoutDashboard } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center">
      <div className="bg-card animate-in fade-in flex flex-col items-center gap-4 rounded-lg p-8 opacity-0 shadow-lg duration-300">
        <div className="relative">
          <LayoutDashboard className="text-muted-foreground absolute h-10 w-10 opacity-10" />
          <div className="text-primary animate-spin">
            <Loader2 className="h-12 w-12" />
          </div>
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center gap-1 delay-200 duration-300">
          <h3 className="text-primary text-xl font-semibold">
            Loading Dashboard
          </h3>
          <p className="text-muted-foreground text-sm">
            Preparing your analytics and insights...
          </p>
        </div>

        <div
          className="bg-primary/20 relative mt-4 h-1 w-full overflow-hidden rounded-full"
          style={{ maxWidth: "200px" }}
        >
          <div
            className="bg-primary absolute top-0 left-0 h-full animate-pulse rounded-full"
            style={{ width: "30%" }}
          />
        </div>
      </div>
    </div>
  );
}
