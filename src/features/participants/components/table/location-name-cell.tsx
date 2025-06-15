"use client";

import { useMemo } from "react";
import { isUUID, toTitleCase } from "@/lib/utils";
import {
  useDistrictName,
  useSubcountyName,
  useCountyName,
} from "../../hooks/use-location-names";

type LocationCellProps = {
  value: string | undefined | null;
  type: "district" | "subcounty" | "county";
  fallback?: string;
};

export function DistrictNameCell({
  value,
  fallback = "Unknown",
}: Omit<LocationCellProps, "type">) {
  // Skip lookup if the value is already a name (not a UUID)
  const shouldLookup = useMemo(() => value && isUUID(value), [value]);

  // Always call the hook, but disable if not needed
  const { data, isLoading } = useDistrictName(shouldLookup ? value : null);

  // Determine display value
  const displayValue = useMemo(() => {
    if (isLoading) return "Loading...";
    if (data) return toTitleCase(data);
    if (value && !shouldLookup) return toTitleCase(value);
    return fallback;
  }, [data, isLoading, value, shouldLookup, fallback]);

  return (
    <div className="max-w-[200px] truncate" title={displayValue}>
      {displayValue}
    </div>
  );
}

export function SubcountyNameCell({
  value,
  fallback = "Unknown",
}: Omit<LocationCellProps, "type">) {
  const shouldLookup = useMemo(() => value && isUUID(value), [value]);
  const { data, isLoading } = useSubcountyName(shouldLookup ? value : null);

  const displayValue = useMemo(() => {
    if (isLoading) return "Loading...";
    if (data) return toTitleCase(data);
    if (value && !shouldLookup) return toTitleCase(value);
    return fallback;
  }, [data, isLoading, value, shouldLookup, fallback]);

  return (
    <div className="max-w-[200px] truncate" title={displayValue}>
      {displayValue}
    </div>
  );
}

export function CountyNameCell({
  value,
  fallback = "Uganda",
}: Omit<LocationCellProps, "type">) {
  const shouldLookup = useMemo(() => value && isUUID(value), [value]);
  const { data, isLoading } = useCountyName(shouldLookup ? value : null);

  const displayValue = useMemo(() => {
    if (isLoading) return "Loading...";
    if (data) return toTitleCase(data);
    if (value && !shouldLookup) return toTitleCase(value);
    return fallback;
  }, [data, isLoading, value, shouldLookup, fallback]);

  return (
    <div className="max-w-[200px] truncate" title={displayValue}>
      {displayValue}
    </div>
  );
}
