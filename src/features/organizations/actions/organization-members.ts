 

"use server";

import { db } from "@/lib/db";
import { organizationMembers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

export async function getOrganizationMembers(organizationId: string) {
  try {
    const members = await db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.organization_id, organizationId));

    // Fetch user details from Clerk
    const users = await Promise.all(
      members.map(async (member) => {
        try {
          // Try to initialize Clerk client - wrap in try/catch
          let clerk;
          try {
            clerk = await clerkClient();
          } catch (clerkError) {
            console.error("Failed to initialize Clerk client:", clerkError);
            // Return a minimal user object if Clerk initialization fails
            return {
              id: member.user_id,
              name: "Unknown User",
              email: "No email available",
              role: member.role,
              createdAt: member.created_at
                ? member.created_at.toISOString()
                : new Date().toISOString(),
              updatedAt: member.updated_at
                ? member.updated_at.toISOString()
                : new Date().toISOString(),
            };
          }

          // Try to get user from Clerk - wrap in another try/catch
          let user;
          try {
            user = await clerk.users.getUser(member.user_id);
          } catch (userError) {
            console.error(`Failed to fetch user ${member.user_id}:`, userError);
            // Return a minimal user object if user fetch fails
            return {
              id: member.user_id,
              name: "Unknown User",
              email: "No email available",
              role: member.role,
              createdAt: member.created_at
                ? member.created_at.toISOString()
                : new Date().toISOString(),
              updatedAt: member.updated_at
                ? member.updated_at.toISOString()
                : new Date().toISOString(),
            };
          }

          // If we got this far, we have a valid user
          return {
            id: member.user_id,
            name:
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.username || "Unknown",
            email: user.emailAddresses[0]?.emailAddress || "No email",
            role: member.role,
            createdAt: member.created_at
              ? member.created_at.toISOString()
              : new Date().toISOString(),
            updatedAt: member.updated_at
              ? member.updated_at.toISOString()
              : new Date().toISOString(),
          };
        } catch (error) {
          console.error(`Error processing member ${member.user_id}:`, error);
          // Return a minimal user object if anything else fails
          return {
            id: member.user_id,
            name: "Error fetching user",
            email: "Error",
            role: member.role,
            createdAt: member.created_at
              ? member.created_at.toISOString()
              : new Date().toISOString(),
            updatedAt: member.updated_at
              ? member.updated_at.toISOString()
              : new Date().toISOString(),
          };
        }
      }),
    );

    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching organization members:", error);
    return { success: false, error: "Failed to fetch organization members" };
  }
}

export async function addOrganizationMember(
  organizationId: string,
  userId: string,
  role: string = "member",
) {
  try {
    // Check if user is already a member
    const existingMember = await db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organization_id, organizationId),
          eq(organizationMembers.user_id, userId),
        ),
      )
      .limit(1);

    if (existingMember.length > 0) {
      return {
        success: false,
        error: "User is already a member of this organization",
      };
    }

    // Validate role
    if (!["admin", "member"].includes(role)) {
      return { success: false, error: "Invalid role specified" };
    }

    const [member] = await db
      .insert(organizationMembers)
      .values({
        organization_id: organizationId,
        user_id: userId,
        role,
      })
      .returning();

    revalidatePath("/dashboard/organizations");
    return { success: true, data: member };
  } catch (error) {
    console.error("Error adding organization member:", error);
    return { success: false, error: "Failed to add organization member" };
  }
}

export async function updateOrganizationMemberRole(
  organizationId: string,
  userId: string,
  role: string,
) {
  try {
    // Validate role
    if (!["admin", "member"].includes(role)) {
      return { success: false, error: "Invalid role specified" };
    }

    const [member] = await db
      .update(organizationMembers)
      .set({ role })
      .where(
        and(
          eq(organizationMembers.organization_id, organizationId),
          eq(organizationMembers.user_id, userId),
        ),
      )
      .returning();

    if (!member) {
      return { success: false, error: "Member not found" };
    }

    revalidatePath("/dashboard/organizations");
    return { success: true, data: member };
  } catch (error) {
    console.error("Error updating organization member role:", error);
    return {
      success: false,
      error: "Failed to update organization member role",
    };
  }
}

export async function removeOrganizationMember(
  organizationId: string,
  userId: string,
) {
  try {
    const result = await db
      .delete(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organization_id, organizationId),
          eq(organizationMembers.user_id, userId),
        ),
      )
      .returning();

    if (result.length === 0) {
      return { success: false, error: "Member not found" };
    }

    revalidatePath("/dashboard/organizations");
    return { success: true };
  } catch (error) {
    console.error("Error removing organization member:", error);
    return { success: false, error: "Failed to remove organization member" };
  }
}
