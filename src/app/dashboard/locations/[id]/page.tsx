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
import { getCountry } from '@/features/locations/actions/locations';
import { countries } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { use } from 'react';

type Country = InferSelectModel<typeof countries>;

export default function CountryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('districts');

  useEffect(() => {
    const fetchCountry = async () => {
      setLoading(true);
      const result = await getCountry(unwrappedParams.id);

      if (result.success && result.data) {
        setCountry(result.data);
      }

      setLoading(false);
    };

    fetchCountry();
  }, [unwrappedParams.id]);

  if (!loading && !country) {
    return notFound();
  }

  // Determine which tabs to show based on country
  const isUganda = country?.name === 'Uganda' || country?.code === 'UG';

  return (
    <div className="container mx-auto pt-0 py-10">
      <div className="flex items-start">
        <SiteHeader
          title={country ? `${country.name} Locations` : 'Loading...'}
        />
      </div>

      {loading ? (
        <div className="mt-6">Loading...</div>
      ) : (
        <Tabs
          defaultValue={activeTab}
          className="mt-6"
          onValueChange={tab => setActiveTab(tab)}
        >
          <div className="flex text-lg items-center mb-4 px-4">
            <TabsList>
              <TabsTrigger className="cursor-pointer" value="districts">
                Districts
              </TabsTrigger>

              {isUganda && (
                <>
                  <TabsTrigger className="cursor-pointer" value="counties">
                    Counties / Municipalities
                  </TabsTrigger>
                  <TabsTrigger className="cursor-pointer" value="subcounties">
                    Sub-Counties
                  </TabsTrigger>
                  <TabsTrigger
                    className="cursor-pointer"
                    value="municipalities"
                  >
                    Municipalities
                  </TabsTrigger>
                  <TabsTrigger className="cursor-pointer" value="cities">
                    Cities
                  </TabsTrigger>
                  <TabsTrigger className="cursor-pointer" value="parishes">
                    Parishes
                  </TabsTrigger>
                  <TabsTrigger className="cursor-pointer" value="villages">
                    Villages
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          <TabsContent value="districts" className="space-y-4">
            <DistrictsTab countryId={unwrappedParams.id} />
          </TabsContent>

          {isUganda && (
            <>
              <TabsContent value="counties" className="space-y-4">
                <CountiesTab />
              </TabsContent>

              <TabsContent value="municipalities" className="space-y-4">
                <MunicipalitiesTab />
              </TabsContent>

              <TabsContent value="cities" className="space-y-4">
                <CitiesTab />
              </TabsContent>

              <TabsContent value="subcounties" className="space-y-4">
                <SubCountiesTab />
              </TabsContent>

              <TabsContent value="parishes" className="space-y-4">
                <ParishesTab />
              </TabsContent>

              <TabsContent value="villages" className="space-y-4">
                <VillagesTab />
              </TabsContent>
            </>
          )}
        </Tabs>
      )}
    </div>
  );
}
