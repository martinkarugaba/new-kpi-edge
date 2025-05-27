'use client';

import { SubCountiesTable } from '../subcounties-table';
import { useEffect, useState } from 'react';
import { subCounties, districts, counties, countries } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { getSubCounties } from '@/features/locations/actions/locations';

type SubCounty = InferSelectModel<typeof subCounties> & {
  district?: InferSelectModel<typeof districts>;
  county?: InferSelectModel<typeof counties>;
  country?: InferSelectModel<typeof countries>;
};

export function SubCountiesTab() {
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
