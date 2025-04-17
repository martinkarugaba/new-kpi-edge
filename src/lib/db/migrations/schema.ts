import {
  pgTable,
  unique,
  text,
  timestamp,
  foreignKey,
  uuid,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", [
  "super_admin",
  "cluster_manager",
  "organization_admin",
  "organization_member",
  "user",
]);

export const users = pgTable(
  "users",
  {
    id: text().primaryKey().notNull(),
    name: text(),
    email: text().notNull(),
    password: text(),
    role: userRole().default("user").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [unique("users_email_unique").on(table.email)],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    token: text().primaryKey().notNull(),
    userId: text("user_id").notNull(),
    expires: timestamp({ mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "password_reset_tokens_user_id_users_id_fk",
    }).onDelete("cascade"),
  ],
);

export const organizations = pgTable(
  "organizations",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    acronym: text().notNull(),
    clusterId: uuid("cluster_id"),
    projectId: uuid("project_id"),
    country: text().notNull(),
    district: text().notNull(),
    subCounty: text("sub_county").notNull(),
    parish: text().notNull(),
    village: text().notNull(),
    address: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.clusterId],
      foreignColumns: [clusters.id],
      name: "organizations_cluster_id_clusters_id_fk",
    }),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "organizations_project_id_projects_id_fk",
    }),
  ],
);

export const kpis = pgTable(
  "kpis",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    target: integer().notNull(),
    unit: text().notNull(),
    frequency: text().notNull(),
    organizationId: uuid("organization_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
      name: "kpis_organization_id_organizations_id_fk",
    }),
  ],
);

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    organizationId: uuid("organization_id").notNull(),
    userId: text("user_id").notNull(),
    role: userRole().default("organization_member").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
      name: "organization_members_organization_id_organizations_id_fk",
    }),
  ],
);

export const clusters = pgTable("clusters", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  about: text(),
  country: text().notNull(),
  districts: text().array().default([""]).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  acronym: text().notNull(),
  description: text(),
  status: text().default("active").notNull(),
  startDate: timestamp("start_date", { mode: "string" }),
  endDate: timestamp("end_date", { mode: "string" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
});

export const participants = pgTable(
  "participants",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    country: text().notNull(),
    district: text().notNull(),
    subCounty: text("sub_county").notNull(),
    parish: text().notNull(),
    village: text().notNull(),
    sex: text().notNull(),
    age: integer().notNull(),
    isPwd: text("is_pwd").default("no").notNull(),
    isMother: text("is_mother").default("no").notNull(),
    isRefugee: text("is_refugee").default("no").notNull(),
    designation: text().notNull(),
    enterprise: text().notNull(),
    contact: text().notNull(),
    organizationId: uuid("organization_id").notNull(),
    projectId: uuid("project_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
      name: "participants_organization_id_organizations_id_fk",
    }),
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [projects.id],
      name: "participants_project_id_projects_id_fk",
    }),
  ],
);
