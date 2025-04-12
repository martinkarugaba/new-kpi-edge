"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/features/themes/components/mode-toggle";
import { ThemeSelector } from "@/features/themes/components/theme-selector";

interface SiteHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function SiteHeader({ title, className, ...props }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-2xl px-2 w-full",
        className,
      )}
      {...props}
    >
      <div className="container flex h-12 items-center">
        <div className="mr-4 hidden md:flex">
          <SidebarTrigger />
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {title && <h1 className="text-lg font-semibold">{title}</h1>}
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
