import { db } from '@/lib/db';
import { villages, parishes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getVillages(parishCode: string) {
  try {
    // Get the parish ID using the parish code
    const parish = await db
      .select()
      .from(parishes)
      .where(eq(parishes.code, parishCode))
      .limit(1);

    if (!parish || parish.length === 0) {
      console.error(`No parish found with code: ${parishCode}`);
      return [];
    }

    const parishId = parish[0].id;

    // Get villages using the parish ID
    const villagesList = await db
      .select()
      .from(villages)
      .where(eq(villages.parish_id, parishId));

    return villagesList;
  } catch (error) {
    console.error('Error fetching villages:', error);
    throw error;
  }
}
