"use server";

import { auth } from "./auth";
import { db } from "@/lib/db";
import { organizationMembers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getOrganizationId() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }

    // Check if user exists in database
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    // If user doesn't exist, return null
    if (!user) {
      console.log(`User ${session.user.id} not found in database`);
      return null;
    }

    const [member] = await db
      .select({ organization_id: organizationMembers.organization_id })
      .from(organizationMembers)
      .where(eq(organizationMembers.user_id, session.user.id));

    if (!member) {
      return null;
    }

    return member.organization_id;
  } catch (error) {
    console.error("Error getting organization ID:", error);
    return null;
  }
}
