"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Building2, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getOrganizationId } from "@/features/auth/actions";
import {
  getCurrentOrganizationWithCluster,
  getOrganizationsByCluster,
} from "@/features/organizations/actions/organizations";

interface Organization {
  id: string;
  name: string;
  cluster_id: string | null;
  cluster?: {
    id: string;
    name: string;
  } | null;
}

interface OrganizationsData {
  currentOrg: Organization;
  organizations: Array<{ id: string; name: string }>;
  isClustered: boolean;
}

export function TeamSwitcher() {
  const [open, setOpen] = useState(false);

  const { data: organizationId, isLoading: isLoadingOrgId } = useQuery({
    queryKey: ["organizationId"],
    queryFn: getOrganizationId,
  });

  console.log("Organization ID:", organizationId);

  const { data: organizationsData, isLoading: isLoadingOrgs } =
    useQuery<OrganizationsData | null>({
      queryKey: ["organizations", organizationId],
      queryFn: async (): Promise<OrganizationsData | null> => {
        if (!organizationId) return null;

        // Get current organization with its cluster
        const currentOrgResult =
          await getCurrentOrganizationWithCluster(organizationId);
        console.log("Current org result:", currentOrgResult);

        if (!currentOrgResult.success || !currentOrgResult.data) return null;

        const currentOrg = currentOrgResult.data;

        // If organization belongs to a cluster, get all organizations in that cluster
        if (currentOrg.cluster_id) {
          const orgsResult = await getOrganizationsByCluster(
            currentOrg.cluster_id,
          );
          console.log("Organizations in cluster result:", orgsResult);

          if (!orgsResult.success || !orgsResult.data) return null;

          return {
            currentOrg,
            organizations: orgsResult.data,
            isClustered: true,
          };
        }

        // If organization doesn't belong to a cluster, just return the current organization
        return {
          currentOrg,
          organizations: [currentOrg],
          isClustered: false,
        };
      },
      enabled: !!organizationId,
    });

  console.log("Organizations data:", organizationsData);

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

  const { currentOrg, organizations, isClustered } = organizationsData;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between px-2"
          size="sm"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="truncate">{currentOrg.name}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {isClustered && (
          <>
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{currentOrg.cluster?.name}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          {organizations.map((org) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => {
                // TODO: Implement organization switching
                setOpen(false);
              }}
              className={org.id === currentOrg.id ? "bg-accent" : ""}
            >
              {org.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
