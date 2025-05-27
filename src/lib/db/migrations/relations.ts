import { relations } from 'drizzle-orm/relations';
import {
  users,
  passwordResetTokens,
  clusters,
  organizations,
  projects,
  kpis,
  organizationMembers,
  participants,
} from './schema';

export const passwordResetTokensRelations = relations(
  passwordResetTokens,
  ({ one }) => ({
    user: one(users, {
      fields: [passwordResetTokens.userId],
      references: [users.id],
    }),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  passwordResetTokens: many(passwordResetTokens),
}));

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    cluster: one(clusters, {
      fields: [organizations.clusterId],
      references: [clusters.id],
    }),
    project: one(projects, {
      fields: [organizations.projectId],
      references: [projects.id],
    }),
    kpis: many(kpis),
    organizationMembers: many(organizationMembers),
    participants: many(participants),
  })
);

export const clustersRelations = relations(clusters, ({ many }) => ({
  organizations: many(organizations),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  organizations: many(organizations),
  participants: many(participants),
}));

export const kpisRelations = relations(kpis, ({ one }) => ({
  organization: one(organizations, {
    fields: [kpis.organizationId],
    references: [organizations.id],
  }),
}));

export const organizationMembersRelations = relations(
  organizationMembers,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMembers.organizationId],
      references: [organizations.id],
    }),
  })
);

export const participantsRelations = relations(participants, ({ one }) => ({
  organization: one(organizations, {
    fields: [participants.organizationId],
    references: [organizations.id],
  }),
  project: one(projects, {
    fields: [participants.projectId],
    references: [projects.id],
  }),
}));
