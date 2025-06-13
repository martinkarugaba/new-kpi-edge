"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/features/themes/components/mode-toggle";
import { ThemeSelector } from "@/features/themes/components/theme-selector";
import { DashboardBreadcrumbs } from "./dashboard-breadcrumbs";

interface SiteHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
  text?: string;
  children?: React.ReactNode;
}

export function SiteHeader({ children, className, ...props }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full rounded-t-2xl border-b px-2 backdrop-blur",
        className
      )}
      {...props}
    >
      <div className="container flex h-12 items-center">
        <div className="mr-4 hidden md:flex">
          <SidebarTrigger />
        </div>

        <div className="flex flex-1 flex-col justify-center md:flex-row md:items-center md:justify-between">
          <div className="container py-2 md:py-4">
            <DashboardBreadcrumbs />
            {children}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeSelector />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
