import { db } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  type NewParticipant,
  type ParticipantResponse,
  type ParticipantsResponse,
} from "../types";
import { revalidatePath } from "next/cache";

export async function getParticipants(
  clusterId: string,
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
    console.error("Error getting participants:", error);
    return {
      success: false,
      error: "Failed to get participants",
    };
  }
}

export async function createParticipant(
  data: NewParticipant,
): Promise<ParticipantResponse> {
  try {
    const [participant] = await db
      .insert(participants)
      .values(data)
      .returning();

    revalidatePath(`/clusters/${data.cluster_id}/participants`);
    return {
      success: true,
      data: participant,
    };
  } catch (error) {
    console.error("Error creating participant:", error);
    return {
      success: false,
      error: "Failed to create participant",
    };
  }
}

export async function updateParticipant(
  id: string,
  data: NewParticipant,
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
    console.error("Error updating participant:", error);
    return {
      success: false,
      error: "Failed to update participant",
    };
  }
}

export async function deleteParticipant(
  id: string,
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
    console.error("Error deleting participant:", error);
    return {
      success: false,
      error: "Failed to delete participant",
    };
  }
}
