import { CitiesTable } from '../cities-table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { db } from '@/lib/db';
import {
  cities,
  districts,
  counties,
  subCounties,
  municipalities,
} from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { City } from '@/features/locations/components/data-table/cities-columns';

export async function CitiesTab() {
  const data = await db
    .select({
      id: cities.id,
      name: cities.name,
      code: cities.code,
      country_id: cities.country_id,
      district_id: cities.district_id,
      county_id: cities.county_id,
      sub_county_id: cities.sub_county_id,
      municipality_id: cities.municipality_id,
      created_at: cities.created_at,
      updated_at: cities.updated_at,
      district_name: districts.name,
      county_name: counties.name,
      subcounty_name: subCounties.name,
      municipality_name: municipalities.name,
    })
    .from(cities)
    .leftJoin(districts, eq(districts.id, cities.district_id))
    .leftJoin(counties, eq(counties.id, cities.county_id))
    .leftJoin(subCounties, eq(subCounties.id, cities.sub_county_id))
    .leftJoin(municipalities, eq(municipalities.id, cities.municipality_id));

  // Convert null values to undefined to match City type
  const typedData: City[] = data.map(item => ({
    ...item,
    created_at: item.created_at ?? undefined,
    updated_at: item.updated_at ?? undefined,
    district_name: item.district_name ?? undefined,
    county_name: item.county_name ?? undefined,
    subcounty_name: item.subcounty_name ?? undefined,
    municipality_name: item.municipality_name ?? undefined,
  }));

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Cities Management</h3>
      </CardHeader>
      <CardContent>
        <CitiesTable data={typedData} />
      </CardContent>
    </Card>
  );
}
