"use server";

import { db } from "@/lib/db";
import { organizationMembers, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/features/auth/auth";

export async function getOrganizationMembers(organizationId: string) {
  try {
    console.log("Fetching members for organization:", organizationId);

    const members = await db.query.organizationMembers.findMany({
      where: eq(organizationMembers.organization_id, organizationId),
    });

    console.log("Raw members data:", members);

    if (!members || members.length === 0) {
      console.log("No members found for organization");
      return { success: true, data: [] };
    }

    // Get user details for each member
    const membersWithUserDetails = await Promise.all(
      members.map(async (member) => {
        try {
          const user = await db.query.users.findFirst({
            where: eq(users.id, member.user_id),
          });

          return {
            id: member.user_id,
            name: user?.name || "Unknown User",
            email: user?.email || "",
            role: member.role,
            createdAt:
              member.created_at?.toISOString() || new Date().toISOString(),
            updatedAt:
              member.updated_at?.toISOString() || new Date().toISOString(),
          };
        } catch (error) {
          console.error(
            `Error fetching user details for member ${member.user_id}:`,
            error,
          );
          return {
            id: member.user_id,
            name: "Unknown User",
            email: "",
            role: member.role,
            createdAt:
              member.created_at?.toISOString() || new Date().toISOString(),
            updatedAt:
              member.updated_at?.toISOString() || new Date().toISOString(),
          };
        }
      }),
    );

    console.log("Members with user details:", membersWithUserDetails);
    return { success: true, data: membersWithUserDetails };
  } catch (error) {
    console.error("Error in getOrganizationMembers:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch members",
      data: [],
    };
  }
}

export async function addOrganizationMember(
  organizationId: string,
  userId: string,
  role: string = "member",
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check if user is already a member
    const existingMember = await db.query.organizationMembers.findFirst({
      where:
        eq(organizationMembers.organization_id, organizationId) &&
        eq(organizationMembers.user_id, userId),
    });

    if (existingMember) {
      return {
        success: false,
        error: "User is already a member of this organization",
      };
    }

    // Add the member
    await db.insert(organizationMembers).values({
      organization_id: organizationId,
      user_id: userId,
      role: role,
    });

    revalidatePath("/dashboard/organizations/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Error adding organization member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add member",
    };
  }
}

export async function updateOrganizationMemberRole(
  organizationId: string,
  userId: string,
  role: string,
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    await db
      .update(organizationMembers)
      .set({ role: role })
      .where(
        eq(organizationMembers.organization_id, organizationId) &&
          eq(organizationMembers.user_id, userId),
      );

    revalidatePath("/dashboard/organizations/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating organization member role:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update member role",
    };
  }
}

export async function removeOrganizationMember(
  organizationId: string,
  userId: string,
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return { success: false, error: "Not authenticated" };
    }

    await db
      .delete(organizationMembers)
      .where(
        eq(organizationMembers.organization_id, organizationId) &&
          eq(organizationMembers.user_id, userId),
      );

    revalidatePath("/dashboard/organizations/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Error removing organization member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove member",
    };
  }
}
