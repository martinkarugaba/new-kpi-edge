'use client';

import { CountriesTable } from '../countries-table';
import { useEffect, useState } from 'react';
import { countries } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { getCountries } from '@/features/locations/actions/locations';

type Country = InferSelectModel<typeof countries>;

export function CountriesTab() {
  const [data, setData] = useState<Country[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCountries();
      if (result.success && result.data) {
        setData(result.data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <CountriesTable data={data} />
    </div>
  );
}
