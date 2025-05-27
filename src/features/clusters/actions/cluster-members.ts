'use server';

import { db } from '@/lib/db';
import { clusterMembers, organizations, clusters } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Get organizations that are members of a specific cluster
export async function getClusterOrganizations(clusterId: string) {
  try {
    const members = await db
      .select({
        organization: {
          id: organizations.id,
          name: organizations.name,
          acronym: organizations.acronym,
          cluster_id: organizations.cluster_id,
          project_id: organizations.project_id,
          country: organizations.country,
          district: organizations.district,
          sub_county_id: organizations.sub_county_id,
          parish: organizations.parish,
          village: organizations.village,
          address: organizations.address,
          created_at: organizations.created_at,
          updated_at: organizations.updated_at,
        },
        cluster: {
          id: clusters.id,
          name: clusters.name,
        },
        membership: {
          id: clusterMembers.id,
          created_at: clusterMembers.created_at,
          updated_at: clusterMembers.updated_at,
        },
      })
      .from(clusterMembers)
      .innerJoin(
        organizations,
        eq(clusterMembers.organization_id, organizations.id)
      )
      .innerJoin(clusters, eq(clusterMembers.cluster_id, clusters.id))
      .where(eq(clusterMembers.cluster_id, clusterId));

    // Format the response
    const formattedOrgs = members.map(member => ({
      ...member.organization,
      cluster: member.cluster,
    }));

    return { success: true, data: formattedOrgs };
  } catch (error) {
    console.error('Error fetching cluster organizations:', error);
    return { success: false, error: 'Failed to fetch cluster organizations' };
  }
}

// Check if an organization is a member of a specific cluster
export async function isOrganizationInCluster(
  organizationId: string,
  clusterId: string
) {
  try {
    const member = await db.query.clusterMembers.findFirst({
      where: and(
        eq(clusterMembers.organization_id, organizationId),
        eq(clusterMembers.cluster_id, clusterId)
      ),
    });

    return { success: true, data: !!member };
  } catch (error) {
    console.error('Error checking organization cluster membership:', error);
    return {
      success: false,
      error: 'Failed to check organization cluster membership',
    };
  }
}

// Add an organization to a cluster
export async function addOrganizationToCluster(
  organizationId: string,
  clusterId: string
) {
  try {
    // Check if already a member
    const existingMember = await db.query.clusterMembers.findFirst({
      where: and(
        eq(clusterMembers.organization_id, organizationId),
        eq(clusterMembers.cluster_id, clusterId)
      ),
    });

    if (existingMember) {
      return { success: true, data: existingMember };
    }

    // Add to cluster
    const [newMember] = await db
      .insert(clusterMembers)
      .values({
        organization_id: organizationId,
        cluster_id: clusterId,
      })
      .returning();

    return { success: true, data: newMember };
  } catch (error) {
    console.error('Error adding organization to cluster:', error);
    return { success: false, error: 'Failed to add organization to cluster' };
  }
}

// Remove an organization from a cluster
export async function removeOrganizationFromCluster(
  organizationId: string,
  clusterId: string
) {
  try {
    await db
      .delete(clusterMembers)
      .where(
        and(
          eq(clusterMembers.organization_id, organizationId),
          eq(clusterMembers.cluster_id, clusterId)
        )
      );

    return { success: true };
  } catch (error) {
    console.error('Error removing organization from cluster:', error);
    return {
      success: false,
      error: 'Failed to remove organization from cluster',
    };
  }
}
