'use client';

import { CountriesTable } from '../countries-table';
import { useEffect, useState } from 'react';
import { countries } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { getCountries } from '@/features/locations/actions/countries';

type Country = InferSelectModel<typeof countries>;

export function CountriesTab() {
  const [data, setData] = useState<Country[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCountries();
      if (result.success) {
        setData(result.data.data);
      }
    };

    fetchData();
  }, []);

  return <CountriesTable data={data} />;
}
