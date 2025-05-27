'use server';

import { db } from '@/lib/db';
import { clusterMembers } from '@/lib/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateOrganizationClusters(
  organizationId: string,
  clusterIds: string[]
) {
  try {
    // Get existing cluster memberships for this organization
    const existingMemberships = await db
      .select({
        id: clusterMembers.id,
        cluster_id: clusterMembers.cluster_id,
      })
      .from(clusterMembers)
      .where(eq(clusterMembers.organization_id, organizationId));

    // Determine which memberships to add and which to remove
    const existingClusterIds = existingMemberships.map(m => m.cluster_id);

    // Clusters to add (in clusterIds but not in existingClusterIds)
    const clustersToAdd = clusterIds.filter(
      id => !existingClusterIds.includes(id)
    );

    // Memberships to remove (in existingMemberships but their cluster_id not in clusterIds)
    const membershipIdsToRemove = existingMemberships
      .filter(m => !clusterIds.includes(m.cluster_id))
      .map(m => m.id);

    // Execute the changes as a transaction
    await db.transaction(async tx => {
      // Add new memberships
      if (clustersToAdd.length > 0) {
        await tx.insert(clusterMembers).values(
          clustersToAdd.map(clusterId => ({
            cluster_id: clusterId,
            organization_id: organizationId,
          }))
        );
      }

      // Remove old memberships
      if (membershipIdsToRemove.length > 0) {
        await tx
          .delete(clusterMembers)
          .where(
            and(
              eq(clusterMembers.organization_id, organizationId),
              inArray(clusterMembers.id, membershipIdsToRemove)
            )
          );
      }
    });

    // Revalidate related paths
    revalidatePath('/dashboard/organizations');
    revalidatePath(`/dashboard/organizations/${organizationId}`);
    revalidatePath('/dashboard/clusters');

    return { success: true };
  } catch (error) {
    console.error('Error updating organization clusters:', error);
    return { success: false, error: 'Failed to update organization clusters' };
  }
}
