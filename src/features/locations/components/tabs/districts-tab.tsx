"use client";

import { DistrictsTable } from "../districts-table";
import { useEffect, useState } from "react";
import { districts } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { getDistricts } from "@/features/locations/actions/locations";

type District = InferSelectModel<typeof districts>;

// Use a type instead of an empty interface
type DistrictsTabProps = Record<string, never>;

export function DistrictsTab({}: DistrictsTabProps) {
  const [data, setData] = useState<District[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getDistricts();
      if (result.success && result.data) {
        setData(result.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <DistrictsTable data={data} />
    </div>
  );
}
