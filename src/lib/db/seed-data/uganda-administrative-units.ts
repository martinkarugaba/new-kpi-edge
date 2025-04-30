import { db } from "../index";
import {
  countries,
  districts,
  subCounties,
  parishes,
  villages,
} from "../schema";

// Define the expected structure for Uganda administrative units
interface Village {
  name: string;
  code: string;
}

interface Parish {
  name: string;
  code: string;
  villages: Village[];
}

interface SubCounty {
  name: string;
  code: string;
  parishes: Parish[];
}

interface District {
  name: string;
  code: string;
  subCounties: SubCounty[];
}

interface Region {
  name: string;
  districts: District[];
}

interface UgandaAdministrativeUnits {
  name: string;
  code: string;
  regions: Region[];
}

// Mock data or import from correct location
const ugandaAdministrativeUnits: UgandaAdministrativeUnits = {
  name: "Uganda",
  code: "UG",
  regions: [
    // You'll need to replace this with actual data
    // This is just a placeholder structure
    {
      name: "Central",
      districts: [
        {
          name: "Kampala",
          code: "KLA",
          subCounties: [
            {
              name: "Central Division",
              code: "CD",
              parishes: [
                {
                  name: "Sample Parish",
                  code: "SP",
                  villages: [{ name: "Sample Village", code: "SV" }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export async function seedUgandaAdministrativeUnits() {
  try {
    console.log("Starting to seed Uganda administrative units...");

    // Insert country
    console.log("Seeding country:", ugandaAdministrativeUnits.name);
    const [uganda] = await db
      .insert(countries)
      .values({
        name: ugandaAdministrativeUnits.name,
        code: ugandaAdministrativeUnits.code,
      })
      .returning();

    console.log("Country added successfully:", uganda.name);

    // Process each region and its districts
    for (const region of ugandaAdministrativeUnits.regions) {
      console.log("Processing region:", region.name);

      for (const district of region.districts) {
        console.log("Seeding district:", district.name);
        // Insert district
        const [districtRecord] = await db
          .insert(districts)
          .values({
            name: district.name,
            code: district.code,
            country_id: uganda.id,
          })
          .returning();

        // Process sub-counties
        for (const subCounty of district.subCounties) {
          console.log("Seeding sub-county:", subCounty.name);
          const [subCountyRecord] = await db
            .insert(subCounties)
            .values({
              name: subCounty.name,
              code: subCounty.code,
              district_id: districtRecord.id,
            })
            .returning();

          // Process parishes
          for (const parish of subCounty.parishes) {
            console.log("Seeding parish:", parish.name);
            const [parishRecord] = await db
              .insert(parishes)
              .values({
                name: parish.name,
                code: parish.code,
                sub_county_id: subCountyRecord.id,
              })
              .returning();

            // Process villages
            console.log("Seeding villages for parish:", parish.name);
            await db.insert(villages).values(
              parish.villages.map((village: Village) => ({
                name: village.name,
                code: village.code,
                parish_id: parishRecord.id,
              })),
            );
          }
        }
      }
    }
    console.log(
      "✅ Uganda administrative units seeding completed successfully",
    );
  } catch (error) {
    console.error("❌ Error seeding Uganda administrative units:", error);
    throw error;
  }
}
