import { db } from "@/lib/db";
import {
  cities,
  countries,
  districts,
  counties,
  subCounties,
  municipalities,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Uganda cities data
const ugandaCities = [
  {
    name: "Kampala",
    code: "UG-KLA-KLA",
    districtCode: "UG-KLA",
    subCountyCode: "UG-KLA-KLA",
    municipalityCode: "UG-KLA-KLA-CEN",
  },
  {
    name: "Entebbe",
    code: "UG-WAK-ENT",
    districtCode: "UG-WAK",
    subCountyCode: "UG-WAK-ENT",
    municipalityCode: "UG-WAK-ENT",
  },
  {
    name: "Jinja",
    code: "UG-JIN-JIN",
    districtCode: "UG-JIN",
    subCountyCode: "UG-JIN-JIN",
    municipalityCode: "UG-JIN-JIN",
  },
  {
    name: "Mbale",
    code: "UG-MBL-MBL",
    districtCode: "UG-MBL",
    subCountyCode: "UG-MBL-MBL",
    municipalityCode: "UG-MBL-MBL",
  },
  {
    name: "Mbarara",
    code: "UG-MBR-MBR",
    districtCode: "UG-MBR",
    subCountyCode: "UG-MBR-MBR",
    municipalityCode: "UG-MBR-MBR",
  },
  {
    name: "Gulu",
    code: "UG-GUL-GUL",
    districtCode: "UG-GUL",
    subCountyCode: "UG-GUL-GUL",
    municipalityCode: "UG-GUL-GUL",
  },
  {
    name: "Lira",
    code: "UG-LIR-LIR",
    districtCode: "UG-LIR",
    subCountyCode: "UG-LIR-LIR",
    municipalityCode: "UG-LIR-LIR",
  },
  {
    name: "Masaka",
    code: "UG-MSK-MSK",
    districtCode: "UG-MSK",
    subCountyCode: "UG-MSK-MSK",
    municipalityCode: "UG-MSK-MSK",
  },
  {
    name: "Soroti",
    code: "UG-SRT-SRT",
    districtCode: "UG-SRT",
    subCountyCode: "UG-SRT-SRT",
    municipalityCode: "UG-SRT-SRT",
  },
  {
    name: "Arua",
    code: "UG-ARU-ARU",
    districtCode: "UG-ARU",
    subCountyCode: "UG-ARU-ARU",
    municipalityCode: "UG-ARU-ARU",
  },
];

export async function seedCities() {
  try {
    console.log("Starting cities seeding...");

    for (const city of ugandaCities) {
      // Get the country ID (Uganda)
      const [country] = await db
        .select()
        .from(countries)
        .where(eq(countries.code, "UG"))
        .limit(1);

      if (!country) {
        console.error("Uganda not found in countries table");
        continue;
      }

      // Get the district ID
      const [district] = await db
        .select()
        .from(districts)
        .where(eq(districts.code, city.districtCode))
        .limit(1);

      if (!district) {
        console.error(`District ${city.districtCode} not found`);
        continue;
      }

      // Get the county ID (using the district code as county code for now)
      const [county] = await db
        .select()
        .from(counties)
        .where(eq(counties.code, city.districtCode))
        .limit(1);

      if (!county) {
        console.error(`County for ${city.districtCode} not found`);
        continue;
      }

      // Get the sub-county ID
      const [subCounty] = await db
        .select()
        .from(subCounties)
        .where(eq(subCounties.code, city.subCountyCode))
        .limit(1);

      if (!subCounty) {
        console.error(`Sub-county ${city.subCountyCode} not found`);
        continue;
      }

      // Get the municipality ID
      const [municipality] = await db
        .select()
        .from(municipalities)
        .where(eq(municipalities.code, city.municipalityCode))
        .limit(1);

      if (!municipality) {
        console.error(`Municipality ${city.municipalityCode} not found`);
        continue;
      }

      // Insert the city
      try {
        await db.insert(cities).values({
          name: city.name,
          code: city.code,
          country_id: country.id,
          district_id: district.id,
          county_id: county.id,
          sub_county_id: subCounty.id,
          municipality_id: municipality.id,
        });
        console.log(`Inserted city: ${city.name}`);
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "23505"
        ) {
          // Unique violation
          console.log(`City ${city.name} already exists`);
        } else {
          console.error(`Error inserting city ${city.name}:`, error);
        }
      }
    }

    console.log("Cities seeding completed");
  } catch (error: unknown) {
    console.error(
      "Error seeding cities:",
      error instanceof Error ? error.message : String(error)
    );
  }
}
