"use server";

import { db } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type NewParticipant } from "./types";

export async function getParticipants(organizationId: string) {
  try {
    console.log("Fetching participants for organization:", organizationId);
    const data = await db
      .select()
      .from(participants)
      .where(eq(participants.organization_id, organizationId));

    console.log("Fetched participants:", data);
    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error fetching participants:", error);
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to fetch participants",
    };
  }
}

export async function createParticipant(data: NewParticipant) {
  try {
    console.log("Creating participant:", data);
    const [participant] = await db
      .insert(participants)
      .values({
        ...data,
        organization_id: data.organization_id,
        project_id: data.project_id,
      })
      .returning();

    console.log("Created participant:", participant);
    revalidatePath(`/dashboard/participants`);
    return { success: true, data: participant, error: null };
  } catch (error) {
    console.error("Error creating participant:", error);
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to create participant",
    };
  }
}

export async function updateParticipant(
  id: string,
  data: Partial<NewParticipant>,
) {
  try {
    console.log("Updating participant:", { id, data });
    const [participant] = await db
      .update(participants)
      .set({
        ...data,
        organization_id: data.organization_id,
        project_id: data.project_id,
      })
      .where(eq(participants.id, id))
      .returning();

    console.log("Updated participant:", participant);
    revalidatePath(`/dashboard/participants`);
    return { success: true, data: participant, error: null };
  } catch (error) {
    console.error("Error updating participant:", error);
    return {
      success: false,
      data: null,
      error:
        error instanceof Error ? error.message : "Failed to update participant",
    };
  }
}

export async function deleteParticipant(id: string, organizationId: string) {
  try {
    console.log("Deleting participant:", { id, organizationId });
    await db.delete(participants).where(eq(participants.id, id));
    revalidatePath(`/dashboard/participants`);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting participant:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete participant",
    };
  }
}
