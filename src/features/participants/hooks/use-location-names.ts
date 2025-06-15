"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDistrictNameById,
  getSubcountyNameById,
  getCountyNameById,
} from "../actions/location-lookup";

/**
 * Hook to fetch district name by ID
 */
export function useDistrictName(districtId: string | undefined | null) {
  return useQuery({
    queryKey: ["district-name", districtId],
    queryFn: () =>
      districtId ? getDistrictNameById(districtId) : Promise.resolve(null),
    enabled: !!districtId && isUUID(districtId),
  });
}

/**
 * Hook to fetch subcounty name by ID
 */
export function useSubcountyName(subcountyId: string | undefined | null) {
  return useQuery({
    queryKey: ["subcounty-name", subcountyId],
    queryFn: () =>
      subcountyId ? getSubcountyNameById(subcountyId) : Promise.resolve(null),
    enabled: !!subcountyId && isUUID(subcountyId),
  });
}

/**
 * Hook to fetch county name by ID
 */
export function useCountyName(countyId: string | undefined | null) {
  return useQuery({
    queryKey: ["county-name", countyId],
    queryFn: () =>
      countyId ? getCountyNameById(countyId) : Promise.resolve(null),
    enabled: !!countyId && isUUID(countyId),
  });
}

/**
 * Helper function to check if a string is a UUID
 */
function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}
