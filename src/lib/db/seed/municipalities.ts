import { db } from "@/lib/db";
import {
  municipalities,
  countries,
  districts,
  counties,
  subCounties,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Uganda municipalities data
const ugandaMunicipalities = [
  {
    name: "Kampala Central",
    code: "UG-KLA-KLA-CEN",
    districtCode: "UG-KLA",
    subCountyCode: "UG-KLA-KLA",
  },
  {
    name: "Kawempe",
    code: "UG-KLA-KAW",
    districtCode: "UG-KLA",
    subCountyCode: "UG-KLA-KAW",
  },
  {
    name: "Makindye",
    code: "UG-KLA-MAK",
    districtCode: "UG-KLA",
    subCountyCode: "UG-KLA-MAK",
  },
  {
    name: "Nakawa",
    code: "UG-KLA-NAK",
    districtCode: "UG-KLA",
    subCountyCode: "UG-KLA-NAK",
  },
  {
    name: "Rubaga",
    code: "UG-KLA-RUB",
    districtCode: "UG-KLA",
    subCountyCode: "UG-KLA-RUB",
  },
  {
    name: "Entebbe",
    code: "UG-WAK-ENT",
    districtCode: "UG-WAK",
    subCountyCode: "UG-WAK-ENT",
  },
  {
    name: "Jinja",
    code: "UG-JIN-JIN",
    districtCode: "UG-JIN",
    subCountyCode: "UG-JIN-JIN",
  },
  {
    name: "Mbale",
    code: "UG-MBL-MBL",
    districtCode: "UG-MBL",
    subCountyCode: "UG-MBL-MBL",
  },
  {
    name: "Mbarara",
    code: "UG-MBR-MBR",
    districtCode: "UG-MBR",
    subCountyCode: "UG-MBR-MBR",
  },
  {
    name: "Gulu",
    code: "UG-GUL-GUL",
    districtCode: "UG-GUL",
    subCountyCode: "UG-GUL-GUL",
  },
];

export async function seedMunicipalities() {
  try {
    console.log("Starting municipalities seeding...");

    for (const municipality of ugandaMunicipalities) {
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
        .where(eq(districts.code, municipality.districtCode))
        .limit(1);

      if (!district) {
        console.error(`District ${municipality.districtCode} not found`);
        continue;
      }

      // Get the county ID (using the district code as county code for now)
      const [county] = await db
        .select()
        .from(counties)
        .where(eq(counties.code, municipality.districtCode))
        .limit(1);

      if (!county) {
        console.error(`County for ${municipality.districtCode} not found`);
        continue;
      }

      // Get the sub-county ID
      const [subCounty] = await db
        .select()
        .from(subCounties)
        .where(eq(subCounties.code, municipality.subCountyCode))
        .limit(1);

      if (!subCounty) {
        console.error(`Sub-county ${municipality.subCountyCode} not found`);
        continue;
      }

      // Insert the municipality
      try {
        await db.insert(municipalities).values({
          name: municipality.name,
          code: municipality.code,
          country_id: country.id,
          district_id: district.id,
          county_id: county.id,
          sub_county_id: subCounty.id,
        });
        console.log(`Inserted municipality: ${municipality.name}`);
      } catch (error: unknown) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "23505"
        ) {
          // Unique violation
          console.log(`Municipality ${municipality.name} already exists`);
        } else {
          console.error(
            `Error inserting municipality ${municipality.name}:`,
            error
          );
        }
      }
    }

    console.log("Municipalities seeding completed");
  } catch (error: unknown) {
    console.error(
      "Error seeding municipalities:",
      error instanceof Error ? error.message : String(error)
    );
  }
}
