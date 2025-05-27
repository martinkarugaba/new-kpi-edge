import { seedMunicipalities } from './municipalities';
import { seedCities } from './cities';

export async function seed() {
  try {
    console.log('Starting database seeding...');

    // Seed municipalities
    await seedMunicipalities();
    await seedCities();

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}
