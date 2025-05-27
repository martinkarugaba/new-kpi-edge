'use client';

import { MunicipalitiesTable } from '../municipalities-table';
import { useEffect, useState } from 'react';
import { municipalities } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { getMunicipalities } from '@/features/locations/actions/municipalities';

type Municipality = InferSelectModel<typeof municipalities> & {
  country: { name: string };
  district: { name: string };
  county: { name: string };
  subCounty: { name: string };
};

export function MunicipalitiesTab() {
  const [data, setData] = useState<Municipality[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMunicipalities();
      if (result.success && result.data) {
        setData(result.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <MunicipalitiesTable municipalities={data} />
    </div>
  );
}
