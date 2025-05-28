'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/features/dashboard/components/site-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DistrictsTab,
  CountiesTab,
  SubCountiesTab,
  MunicipalitiesTab,
  ParishesTab,
  VillagesTab,
  CitiesTab,
} from '@/features/locations/components/tabs';
import { getCountryById } from '@/features/locations/actions/countries';
import { countries } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

type Country = InferSelectModel<typeof countries>;

export default function CountryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [country, setCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchCountry = async () => {
      const result = await getCountryById(params.id);
      if (result.success && result.data) {
        setCountry(result.data);
      } else {
        notFound();
      }
    };

    if (params.id) {
      fetchCountry();
    }
  }, [params.id]);

  if (!country) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4">
      <SiteHeader
        heading="Locations"
        text={`${country.name} - Location Details`}
      />

      <Tabs defaultValue="districts">
        <TabsList>
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="counties">Counties</TabsTrigger>
          <TabsTrigger value="subcounties">Sub Counties</TabsTrigger>
          <TabsTrigger value="municipalities">Municipalities</TabsTrigger>
          <TabsTrigger value="parishes">Parishes</TabsTrigger>
          <TabsTrigger value="villages">Villages</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
        </TabsList>
        <TabsContent value="districts">
          <DistrictsTab countryId={country.id} />
        </TabsContent>
        <TabsContent value="counties">
          <CountiesTab />
        </TabsContent>
        <TabsContent value="subcounties">
          <SubCountiesTab countryId={country.id} />
        </TabsContent>
        <TabsContent value="municipalities">
          <MunicipalitiesTab countryId={country.id} />
        </TabsContent>
        <TabsContent value="parishes">
          <ParishesTab countryId={country.id} />
        </TabsContent>
        <TabsContent value="villages">
          <VillagesTab countryId={country.id} />
        </TabsContent>
        <TabsContent value="cities">
          <CitiesTab countryId={country.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
