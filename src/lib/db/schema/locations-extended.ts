import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

/**
 * Extension to the existing location schema to support urban areas
 * This adds support for cities and municipalities within districts
 */

// District type enum to distinguish between different types of districts
export const districtTypeEnum = pgEnum("district_type", [
  "regular", // Regular rural district
  "city", // City district
  "municipality", // Municipality district
]);

// Add a type field to the existing districts table
// Note: You would need to run a migration to add this column to the existing table
export const districtsExtended = pgTable("districts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  country_id: uuid("country_id").references(() => countries.id),
  region: text("region"),
  // New field to identify district type
  type: districtTypeEnum("type").default("regular"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Table for urban areas (cities or municipalities within districts)
export const urbanAreas = pgTable("urban_areas", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  district_id: uuid("district_id")
    .references(() => districts.id)
    .notNull(),
  // Type: city, municipality, town, etc.
  type: text("type").notNull(),
  // Additional urban area metadata
  population: text("population"),
  area: text("area"),
  status: text("status").default("active"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Table for urban divisions (divisions/zones within a city)
export const urbanDivisions = pgTable("urban_divisions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  urban_area_id: uuid("urban_area_id")
    .references(() => urbanAreas.id)
    .notNull(),
  district_id: uuid("district_id")
    .references(() => districts.id)
    .notNull(),
  country_id: uuid("country_id")
    .references(() => countries.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Table for wards (similar to parishes but in urban settings)
export const wards = pgTable("wards", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  urban_division_id: uuid("urban_division_id")
    .references(() => urbanDivisions.id)
    .notNull(),
  district_id: uuid("district_id")
    .references(() => districts.id)
    .notNull(),
  urban_area_id: uuid("urban_area_id")
    .references(() => urbanAreas.id)
    .notNull(),
  country_id: uuid("country_id")
    .references(() => countries.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Table for blocks/cells (similar to villages but in urban settings)
export const blocks = pgTable("blocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  ward_id: uuid("ward_id")
    .references(() => wards.id)
    .notNull(),
  urban_division_id: uuid("urban_division_id")
    .references(() => urbanDivisions.id)
    .notNull(),
  urban_area_id: uuid("urban_area_id")
    .references(() => urbanAreas.id)
    .notNull(),
  district_id: uuid("district_id")
    .references(() => districts.id)
    .notNull(),
  country_id: uuid("country_id")
    .references(() => countries.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Import existing schema references
import { countries, districts } from "@/lib/db/schema";

// Relations for urban areas
export const urbanAreasRelations = relations(urbanAreas, ({ one, many }) => ({
  district: one(districts, {
    fields: [urbanAreas.district_id],
    references: [districts.id],
  }),
  divisions: many(urbanDivisions),
}));

// Relations for urban divisions
export const urbanDivisionsRelations = relations(
  urbanDivisions,
  ({ one, many }) => ({
    urbanArea: one(urbanAreas, {
      fields: [urbanDivisions.urban_area_id],
      references: [urbanAreas.id],
    }),
    district: one(districts, {
      fields: [urbanDivisions.district_id],
      references: [districts.id],
    }),
    wards: many(wards),
  })
);

// Relations for wards
export const wardsRelations = relations(wards, ({ one, many }) => ({
  urbanDivision: one(urbanDivisions, {
    fields: [wards.urban_division_id],
    references: [urbanDivisions.id],
  }),
  urbanArea: one(urbanAreas, {
    fields: [wards.urban_area_id],
    references: [urbanAreas.id],
  }),
  district: one(districts, {
    fields: [wards.district_id],
    references: [districts.id],
  }),
  blocks: many(blocks),
}));

// Relations for blocks
export const blocksRelations = relations(blocks, ({ one }) => ({
  ward: one(wards, {
    fields: [blocks.ward_id],
    references: [wards.id],
  }),
  urbanDivision: one(urbanDivisions, {
    fields: [blocks.urban_division_id],
    references: [urbanDivisions.id],
  }),
  urbanArea: one(urbanAreas, {
    fields: [blocks.urban_area_id],
    references: [urbanAreas.id],
  }),
  district: one(districts, {
    fields: [blocks.district_id],
    references: [districts.id],
  }),
}));
