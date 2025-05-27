'use client';

import { CountiesTable } from '../counties-table';
import { useEffect, useState } from 'react';
import { counties, districts } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { getCounties } from '@/features/locations/actions/locations';

type District = InferSelectModel<typeof districts>;

type County = InferSelectModel<typeof counties> & {
  district?: District;
};

// No props needed for this component
export function CountiesTab() {
  const [data, setData] = useState<County[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCounties();
      if (result.success && result.data) {
        setData(result.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <CountiesTable data={data} />
    </div>
  );
}
