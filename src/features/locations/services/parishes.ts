import { db } from '@/lib/db';
import { parishes, subCounties } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getParishes(
  subCountyCode: string,
  subCountyName?: string
) {
  try {
    // Get the sub-county ID using the sub-county code
    const subCounty = await db
      .select()
      .from(subCounties)
      .where(eq(subCounties.code, subCountyCode))
      .limit(1);

    if (!subCounty || subCounty.length === 0) {
      console.error(`No sub-county found with code: ${subCountyCode}`);

      // If subCountyName is provided and no DB results, return mock data
      if (subCountyName) {
        console.log('No parishes found in DB, using mock data');
        return [
          { code: 'parish1', name: `${subCountyName} Central Parish` },
          { code: 'parish2', name: `${subCountyName} East Parish` },
          { code: 'parish3', name: `${subCountyName} West Parish` },
        ];
      }

      return [];
    }

    const subCountyId = subCounty[0].id;

    // Get parishes using the sub-county ID
    const parishesList = await db
      .select()
      .from(parishes)
      .where(eq(parishes.sub_county_id, subCountyId));

    // If no parishes found but subCountyName provided, return mock data
    if (parishesList.length === 0 && subCountyName) {
      console.log('No parishes found in DB, using mock data');
      return [
        { code: 'parish1', name: `${subCountyName} Central Parish` },
        { code: 'parish2', name: `${subCountyName} East Parish` },
        { code: 'parish3', name: `${subCountyName} West Parish` },
      ];
    }

    return parishesList;
  } catch (error) {
    console.error('Error fetching parishes:', error);
    throw error;
  }
}
