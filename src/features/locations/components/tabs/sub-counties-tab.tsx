"use client";

import { SubCountiesTable } from "../subcounties-table";
import { useEffect, useState } from "react";
import { subCounties } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { getSubCounties } from "@/features/locations/actions/locations";

type SubCounty = InferSelectModel<typeof subCounties>;

// Use a type instead of an empty interface
type SubCountiesTabProps = Record<string, never>;

export function SubCountiesTab({}: SubCountiesTabProps) {
  const [data, setData] = useState<SubCounty[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getSubCounties();
      if (result.success && result.data) {
        setData(result.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <SubCountiesTable data={data} />
    </div>
  );
}
