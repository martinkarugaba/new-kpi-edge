import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  clerkId: text("clerk_id").notNull().unique(),
  clusterId: uuid("cluster_id").references(() => clusters.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clusters = pgTable("clusters", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  about: text("about"),
  country: text("country").notNull(),
  districts: text("districts").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const kpis = pgTable("kpis", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  target: integer("target").notNull(),
  unit: text("unit").notNull(),
  frequency: text("frequency").notNull(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ one }) => ({
  cluster: one(clusters, {
    fields: [organizations.clusterId],
    references: [clusters.id],
  }),
}));

export const clustersRelations = relations(clusters, ({ many }) => ({
  organizations: many(organizations),
}));

export const kpisRelations = relations(kpis, ({ one }) => ({
  organization: one(organizations, {
    fields: [kpis.organizationId],
    references: [organizations.id],
  }),
}));
