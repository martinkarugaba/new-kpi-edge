"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setCurrentOrganization } from "@/features/auth/actions/set-organization";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getOrganizationId } from "@/features/auth/actions";
import {
  getCurrentOrganizationWithCluster,
  getOrganizationsByCluster,
} from "@/features/organizations/actions/organizations";
import { getCurrentUserClusterOrganizations } from "@/features/clusters/actions/cluster-users";

interface Organization {
  id: string;
  name: string;
  acronym: string;
  cluster_id: string | null;
  project_id: string | null;
  country: string;
  district: string;
  sub_county: string;
  parish: string;
  village: string;
  address: string;
  created_at: Date | null;
  updated_at: Date | null;
  cluster?: {
    id: string;
    name: string;
  } | null;
  project?: {
    id: string;
    name: string;
    acronym: string;
  } | null;
}

interface OrganizationsData {
  currentOrg: Organization;
  organizations: Organization[];
  isClustered: boolean;
}

export function TeamSwitcher() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { isMobile } = useSidebar();

  const { data: organizationId, isLoading: isLoadingOrgId } = useQuery({
    queryKey: ["organizationId"],
    queryFn: getOrganizationId,
  });

  const { data: organizationsData, isLoading: isLoadingOrgs } =
    useQuery<OrganizationsData | null>({
      queryKey: ["organizations", organizationId],
      queryFn: async (): Promise<OrganizationsData | null> => {
        if (!organizationId) return null;

        // Fetch the current organization with its cluster
        const currentOrgResult =
          await getCurrentOrganizationWithCluster(organizationId);
        if (!currentOrgResult.success || !currentOrgResult.data) return null;

        const currentOrg = currentOrgResult.data;

        // Fetch organizations from the cluster members table - these are the ones
        // explicitly connected via the cluster_members table
        let clusterOrgs: Organization[] = [];
        let userClusterOrgs: Organization[] = [];
        let isClustered = false;

        // Get organizations from the current org's cluster if it belongs to one
        if (currentOrg.cluster_id) {
          const orgsResult = await getOrganizationsByCluster(
            currentOrg.cluster_id,
          );
          if (orgsResult.success && orgsResult.data) {
            clusterOrgs = orgsResult.data;
            isClustered = true;
          }
        }

        // Get organizations from clusters the user belongs to through the cluster_users table
        const userOrgsResult = await getCurrentUserClusterOrganizations();
        if (userOrgsResult.success === true) {
          // Use type assertion to help TypeScript understand the structure
          const successResult = userOrgsResult as {
            success: true;
            data: Organization[];
          };
          userClusterOrgs = successResult.data;
          isClustered = isClustered || userClusterOrgs.length > 0;
        }

        // Combine and deduplicate organizations from both sources
        const combinedOrgs = [...clusterOrgs];

        // Add organizations from user's clusters if not already included
        for (const org of userClusterOrgs) {
          if (!combinedOrgs.find((existingOrg) => existingOrg.id === org.id)) {
            combinedOrgs.push(org);
          }
        }

        // Always include the current organization
        if (!combinedOrgs.find((org) => org.id === currentOrg.id)) {
          combinedOrgs.push(currentOrg);
        }

        return {
          currentOrg,
          organizations: combinedOrgs,
          isClustered,
        };
      },
      enabled: !!organizationId,
      // Refetch when the window regains focus to ensure fresh data
      refetchOnWindowFocus: true,
      // Cache for a short time to avoid excessive requests (10 seconds)
      staleTime: 10 * 1000,
      // Set up a refresh interval to periodically check for changes (30 seconds)
      refetchInterval: 30 * 1000,
    });

  if (isLoadingOrgId || isLoadingOrgs) {
    return (
      <Button variant="ghost" className="w-full justify-between px-2" size="sm">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          <span className="truncate">Loading...</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>
    );
  }

  if (!organizationsData) {
    return null;
  }

  const { currentOrg, organizations } = organizationsData;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentOrg.acronym}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentOrg.cluster?.name
                    ? `${currentOrg.cluster.name} | `
                    : ""}
                  {currentOrg.district}, {currentOrg.country}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((org, index) => (
              <DropdownMenuItem
                key={org.id}
                onClick={async () => {
                  try {
                    const result = await setCurrentOrganization(org.id);
                    if (result.success) {
                      router.refresh();
                      setOpen(false);
                    } else {
                      toast.error(
                        result.error || "Failed to switch organization",
                      );
                    }
                  } catch (error) {
                    toast.error("Failed to switch organization");
                    console.error(error);
                  }
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Building2 className="size-4 shrink-0" />
                </div>
                {org.acronym}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add organization
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
