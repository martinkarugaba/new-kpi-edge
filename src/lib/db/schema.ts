import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  acronym: text("acronym").notNull(),
  cluster_id: uuid("cluster_id").references(() => clusters.id),
  project_id: uuid("project_id").references(() => projects.id),
  country: text("country").notNull(),
  district: text("district").notNull(),
  sub_county: text("sub_county").notNull(),
  parish: text("parish").notNull(),
  village: text("village").notNull(),
  address: text("address").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
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

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  acronym: text("acronym").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  organization_id: uuid("organization_id")
    .references(() => organizations.id)
    .notNull(),
  user_id: text("user_id").notNull(), // Clerk user ID
  role: text("role").notNull().default("member"), // member, admin, etc.
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Relations
export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    cluster: one(clusters, {
      fields: [organizations.cluster_id],
      references: [clusters.id],
    }),
    project: one(projects, {
      fields: [organizations.project_id],
      references: [projects.id],
    }),
    members: many(organizationMembers),
  }),
);

export const clustersRelations = relations(clusters, ({ many }) => ({
  organizations: many(organizations),
}));

export const kpisRelations = relations(kpis, ({ one }) => ({
  organization: one(organizations, {
    fields: [kpis.organizationId],
    references: [organizations.id],
  }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  organizations: many(organizations),
}));

export const organizationMembersRelations = relations(
  organizationMembers,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMembers.organization_id],
      references: [organizations.id],
    }),
  }),
);
