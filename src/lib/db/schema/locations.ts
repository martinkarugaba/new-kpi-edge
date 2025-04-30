import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const countries = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const districts = pgTable("districts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  country_id: uuid("country_id")
    .references(() => countries.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const subCounties = pgTable("sub_counties", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  district_id: uuid("district_id")
    .references(() => districts.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const parishes = pgTable("parishes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  sub_county_id: uuid("sub_county_id")
    .references(() => subCounties.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const villages = pgTable("villages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  parish_id: uuid("parish_id")
    .references(() => parishes.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Relations
export const countriesRelations = relations(countries, ({ many }) => ({
  districts: many(districts),
}));

export const districtsRelations = relations(districts, ({ one, many }) => ({
  country: one(countries, {
    fields: [districts.country_id],
    references: [countries.id],
  }),
  subCounties: many(subCounties),
}));

export const subCountiesRelations = relations(subCounties, ({ one, many }) => ({
  district: one(districts, {
    fields: [subCounties.district_id],
    references: [districts.id],
  }),
  parishes: many(parishes),
}));

export const parishesRelations = relations(parishes, ({ one, many }) => ({
  subCounty: one(subCounties, {
    fields: [parishes.sub_county_id],
    references: [subCounties.id],
  }),
  villages: many(villages),
}));

export const villagesRelations = relations(villages, ({ one }) => ({
  parish: one(parishes, {
    fields: [villages.parish_id],
    references: [parishes.id],
  }),
}));
