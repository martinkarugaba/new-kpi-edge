'use client';

import { DistrictsTable } from '../districts-table';
import { useEffect, useState } from 'react';
import { countries, districts } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { getDistricts } from '@/features/locations/actions/districts';

type Country = InferSelectModel<typeof countries>;

type District = InferSelectModel<typeof districts> & {
  country?: Country;
};

interface DistrictsTabProps {
  countryId?: string;
}

export function DistrictsTab({ countryId }: DistrictsTabProps) {
  const [data, setData] = useState<District[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getDistricts({ countryId });
      if (result.success) {
        setData(result.data.data);
      }
    };

    fetchData();
  }, [countryId]);

  return <DistrictsTable data={data} />;
}
