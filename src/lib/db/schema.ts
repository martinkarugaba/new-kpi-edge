import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

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

export const userRole = pgEnum("user_role", [
  "super_admin",
  "cluster_manager",
  "organization_admin",
  "organization_member",
  "user",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password"),
  role: userRole("role").default("user").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  organization_id: uuid("organization_id")
    .references(() => organizations.id)
    .notNull(),
  user_id: text("user_id").notNull(), // Clerk user ID
  role: userRole("role").notNull().default("organization_member"),
  last_accessed: timestamp("last_accessed"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const participants = pgTable("participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  country: text("country").notNull(),
  district: text("district").notNull(),
  subCounty: text("sub_county").notNull(),
  parish: text("parish").notNull(),
  village: text("village").notNull(),
  sex: text("sex").notNull(),
  age: integer("age").notNull(),
  isPWD: text("is_pwd").notNull().default("no"),
  isMother: text("is_mother").notNull().default("no"),
  isRefugee: text("is_refugee").notNull().default("no"),
  designation: text("designation").notNull(),
  enterprise: text("enterprise").notNull(),
  contact: text("contact").notNull(),
  organization_id: uuid("organization_id")
    .references(() => organizations.id)
    .notNull(),
  project_id: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  token: text("token").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
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
    participants: many(participants),
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

export const usersRelations = relations(users, ({ many }) => ({
  organizations: many(organizationMembers),
}));

export const organizationMembersRelations = relations(
  organizationMembers,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMembers.organization_id],
      references: [organizations.id],
    }),
    user: one(users, {
      fields: [organizationMembers.user_id],
      references: [users.id],
    }),
  }),
);

export const participantsRelations = relations(participants, ({ one }) => ({
  organization: one(organizations, {
    fields: [participants.organization_id],
    references: [organizations.id],
  }),
  project: one(projects, {
    fields: [participants.project_id],
    references: [projects.id],
  }),
}));
