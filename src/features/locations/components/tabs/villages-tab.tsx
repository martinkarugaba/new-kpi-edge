'use client';

import { VillagesTable } from '../villages-table';
import { useEffect, useState } from 'react';
import {
  villages,
  parishes,
  subCounties,
  counties,
  districts,
  countries,
} from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { getVillages } from '@/features/locations/actions/locations';

type Village = InferSelectModel<typeof villages> & {
  parish?: InferSelectModel<typeof parishes>;
  subCounty?: InferSelectModel<typeof subCounties>;
  county?: InferSelectModel<typeof counties>;
  district?: InferSelectModel<typeof districts>;
  country?: InferSelectModel<typeof countries>;
};

export function VillagesTab() {
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
