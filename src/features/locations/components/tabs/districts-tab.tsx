'use client';

import { DistrictsTable } from '../districts-table';
import { useEffect, useState } from 'react';
import { countries, districts } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import {
  getDistricts,
  getDistrictsByCountry,
} from '@/features/locations/actions/locations';

type Country = InferSelectModel<typeof countries>;

type District = InferSelectModel<typeof districts> & {
  country?: Country;
};

interface DistrictsTabProps {
  countryId?: string;
}

export function DistrictsTab({ countryId }: DistrictsTabProps = {}) {
  const [data, setData] = useState<District[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      let result;
      if (countryId) {
        result = await getDistrictsByCountry(countryId);
      } else {
        result = await getDistricts();
      }
      console.log('Districts data:', result.data);
      if (result.success && result.data) {
        setData(result.data);
      }
    };

    fetchData();
  }, [countryId]);

  return (
    <div className="p-4">
      <DistrictsTable data={data} />
    </div>
  );
}
