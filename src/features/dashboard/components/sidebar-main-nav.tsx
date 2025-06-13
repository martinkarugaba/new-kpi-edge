"use client";

import { navigationData } from "../data/sidebar-navigation";
import { NavMain } from "./nav-main";
import { NavDocuments } from "./nav-kpis";
import { NavSecondary } from "./nav-secondary";

export function SidebarMainNav() {
  return (
    <>
      <NavMain items={navigationData.navMain} />
      <NavDocuments items={navigationData.kpis} />
      <NavSecondary items={navigationData.navSecondary} className="mt-auto" />
    </>
  );
}
