"use client";

import { useEffect, useState } from "react";
import { CitiesTable } from "../cities-table";
import type { City } from "@/features/locations/components/data-table/cities-columns";
import { getCities } from "@/features/locations/actions/cities";

interface CitiesTabProps {
  countryId: string;
}

export function CitiesTab({ countryId }: CitiesTabProps) {
  const [data, setData] = useState<City[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      const result = await getCities(countryId);
      if (result.success && result.data) {
        setData(result.data);
      }
    };

    fetchCities();
  }, [countryId]);

  return (
    <div className="p-4">
      <CitiesTable data={data} />
    </div>
  );
}
