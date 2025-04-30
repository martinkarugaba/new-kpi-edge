"use client";

import { VillagesTable } from "../villages-table";
import { useEffect, useState } from "react";
import { villages } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { getVillages } from "@/features/locations/actions/locations";

type Village = InferSelectModel<typeof villages>;

// Use a type instead of an empty interface
type VillagesTabProps = Record<string, never>;

export function VillagesTab({}: VillagesTabProps) {
  const [data, setData] = useState<Village[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getVillages();
      if (result.success && result.data) {
        setData(result.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <VillagesTable data={data} />
    </div>
  );
}
