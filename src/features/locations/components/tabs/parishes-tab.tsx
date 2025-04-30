"use client";

import { ParishesTable } from "../parishes-table";
import { useEffect, useState } from "react";
import { parishes } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { getParishes } from "@/features/locations/actions/locations";

type Parish = InferSelectModel<typeof parishes>;

// Use a type instead of an empty interface
type ParishesTabProps = Record<string, never>;

export function ParishesTab({}: ParishesTabProps) {
  const [data, setData] = useState<Parish[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getParishes();
      if (result.success && result.data) {
        setData(result.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <ParishesTable data={data} />
    </div>
  );
}
