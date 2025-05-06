"use client";

import { DistrictsTable } from "../districts-table";
import { useEffect, useState } from "react";
import { countries, districts } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { getDistricts } from "@/features/locations/actions/locations";

type Country = InferSelectModel<typeof countries>;

type District = InferSelectModel<typeof districts> & {
  country?: Country;
};

export function DistrictsTab() {
  const [data, setData] = useState<District[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getDistricts();
      console.log("Districts data:", result.data);
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
