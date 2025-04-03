import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  clerkId: text("clerk_id").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clusters = pgTable("clusters", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  about: text("about"),
  country: text("country").notNull(),
  districts: text("districts").array().notNull().default([]),
  organizationId: uuid("organization_id").references(() => organizations.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const kpis = pgTable("kpis", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  target: integer("target").notNull(),
  clusterId: uuid("cluster_id").references(() => clusters.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
