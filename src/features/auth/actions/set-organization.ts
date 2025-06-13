"use server";

import { auth } from "@/features/auth/auth";
import { db } from "@/lib/db";
import { organizationMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function setCurrentOrganization(organizationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Verify that user is a member of the organization
    const member = await db.query.organizationMembers.findFirst({
      where:
        eq(organizationMembers.organization_id, organizationId) &&
        eq(organizationMembers.user_id, session.user.id),
    });

    if (!member) {
      return { success: false, error: "Not a member of this organization" };
    }

    // Store the current organization ID in the user's session
    // (This will be used by getOrganizationId to return the current org)
    await db
      .update(organizationMembers)
      .set({ last_accessed: new Date() })
      .where(
        eq(organizationMembers.organization_id, organizationId) &&
          eq(organizationMembers.user_id, session.user.id)
      );

    return { success: true };
  } catch (error) {
    console.error("Error setting current organization:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to set organization",
    };
  }
}
