'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { participants, organizations, clusterMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import {
  type NewParticipant,
  type ParticipantResponse,
  type ParticipantsResponse,
} from '../types/types';

export async function getParticipants(
  clusterId: string
): Promise<ParticipantsResponse> {
  try {
    const data = await db.query.participants.findMany({
      where: eq(participants.cluster_id, clusterId),
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Error getting participants:', error);
    return {
      success: false,
      error: 'Failed to get participants',
    };
  }
}

export async function createParticipant(
  data: NewParticipant
): Promise<ParticipantResponse> {
  try {
    if (!data.cluster_id || !data.project_id || !data.organization_id) {
      return {
        success: false,
        error: 'cluster_id, project_id, and organization_id are required',
      };
    }

    // Verify that the organization exists and belongs to the cluster
    const organization = await db.query.organizations.findFirst({
      where: eq(organizations.id, data.organization_id),
    });

    if (!organization) {
      return {
        success: false,
        error: 'Organization not found',
      };
    }

    // Verify that the organization belongs to the cluster
    const clusterMember = await db.query.clusterMembers.findFirst({
      where: and(
        eq(clusterMembers.organization_id, data.organization_id),
        eq(clusterMembers.cluster_id, data.cluster_id)
      ),
    });

    if (!clusterMember) {
      return {
        success: false,
        error: 'Organization does not belong to the specified cluster',
      };
    }

    const [participant] = await db
      .insert(participants)
      .values({
        ...data,
        cluster_id: data.cluster_id,
        project_id: data.project_id,
        organization_id: data.organization_id,
      })
      .returning();

    revalidatePath(`/clusters/${data.cluster_id}/participants`);
    return {
      success: true,
      data: participant,
    };
  } catch (error) {
    console.error('Error creating participant:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create participant',
    };
  }
}

export async function updateParticipant(
  id: string,
  data: NewParticipant
): Promise<ParticipantResponse> {
  try {
    const [participant] = await db
      .update(participants)
      .set(data)
      .where(eq(participants.id, id))
      .returning();

    revalidatePath(`/clusters/${data.cluster_id}/participants`);
    return {
      success: true,
      data: participant,
    };
  } catch (error) {
    console.error('Error updating participant:', error);
    return {
      success: false,
      error: 'Failed to update participant',
    };
  }
}

export async function deleteParticipant(
  id: string
): Promise<ParticipantResponse> {
  try {
    const [participant] = await db
      .delete(participants)
      .where(eq(participants.id, id))
      .returning();

    revalidatePath(`/clusters/${participant.cluster_id}/participants`);
    return {
      success: true,
      data: participant,
    };
  } catch (error) {
    console.error('Error deleting participant:', error);
    return {
      success: false,
      error: 'Failed to delete participant',
    };
  }
}
