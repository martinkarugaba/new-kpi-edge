"use client";

import { ParishesTable } from "../parishes-table";
import { useEffect, useState } from "react";
import {
  parishes,
  countries,
  counties,
  districts,
  subCounties,
} from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { getParishes } from "@/features/locations/actions/locations";

type Parish = InferSelectModel<typeof parishes> & {
  subCounty?: InferSelectModel<typeof subCounties>;
  district?: InferSelectModel<typeof districts>;
  county?: InferSelectModel<typeof counties>;
  country?: InferSelectModel<typeof countries>;
};

export function ParishesTab() {
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
