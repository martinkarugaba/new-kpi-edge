"use server";

import { auth } from "@/features/auth/auth";
import { db } from "@/lib/db";
import { participants } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { type ParticipantFormValues } from "../components/participant-form";

export async function importParticipants(data: ParticipantFormValues[]) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Ensure all participants have the same organization ID
    const firstOrgId = data[0]?.organization_id;
    if (!firstOrgId) {
      return { success: false, error: "Organization ID is required" };
    }

    // Verify that the user belongs to this organization
    const member = await db.query.organizationMembers.findFirst({
      where: (members) =>
        and(
          eq(members.organization_id, firstOrgId),
          eq(members.user_id, session.user.id),
        ),
    });

    if (!member) {
      return {
        success: false,
        error: "Not authorized to import participants for this organization",
      };
    }

    // Ensure all participants are assigned to the same organization
    const participantsData = data.map((participant) => ({
      ...participant,
      organization_id: firstOrgId,
    }));

    console.log("Starting import with data:", participantsData);

    // Insert all participants
    const result = await db
      .insert(participants)
      .values(
        participantsData.map((participant) => ({
          firstName: participant.firstName,
          lastName: participant.lastName,
          sex: participant.sex,
          age: parseInt(participant.age),
          contact: participant.contact,
          isPWD: participant.isPWD,
          isMother: participant.isMother,
          isRefugee: participant.isRefugee,
          cluster_id: participant.cluster_id,
          project_id: participant.project_id,
          organization_id: participant.organization_id,
          country: participant.country,
          district: participant.district,
          subCounty: participant.subCounty,
          parish: participant.parish,
          village: participant.village,
          designation: participant.designation,
          enterprise: participant.enterprise,
          // Add new fields
          isPermanentResident: participant.isPermanentResident,
          areParentsAlive: participant.areParentsAlive,
          numberOfChildren: parseInt(participant.numberOfChildren),
          employmentStatus: participant.employmentStatus,
          monthlyIncome: parseInt(participant.monthlyIncome),
          mainChallenge: participant.mainChallenge || null,
          skillOfInterest: participant.skillOfInterest || null,
          expectedImpact: participant.expectedImpact || null,
          isWillingToParticipate: participant.isWillingToParticipate,
        })),
      )
      .returning();

    console.log("Import result:", result);

    revalidatePath("/dashboard/participants");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error importing participants:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to import participants",
    };
  }
}
