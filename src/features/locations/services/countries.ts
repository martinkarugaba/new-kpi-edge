import { Country } from 'country-state-city';
import { db } from '@/lib/db';
import { countries } from '@/lib/db/schema';

export async function getCountries() {
  try {
    const countriesList = await db.select().from(countries);
    return countriesList;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
}

// Legacy function name for backward compatibility
export async function getAllCountries() {
  try {
    console.log('Fetching countries from database');
    const countriesList = await db
      .select()
      .from(countries)
      .orderBy(countries.name);
    console.log(`Found ${countriesList.length} countries in database`);
    return countriesList;
  } catch (error) {
    console.error('Error fetching countries from database:', error);
    // Fallback to country-state-city if database fails
    return Country.getAllCountries();
  }
}
