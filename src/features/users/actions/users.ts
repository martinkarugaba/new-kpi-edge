"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

// Define types for Clerk user data
// interface ClerkUser {
//   id: string;
//   firstName?: string;
//   lastName?: string;
//   username?: string;
//   emailAddresses: Array<{ emailAddress: string }>;
//   createdAt: string;
// }

export async function getUsers() {
  try {
    // Get all users from Clerk with proper parameters
    console.log("Fetching users from Clerk..."); // Debug log

    // Use the correct method to get users - clerkClient is a function that returns a promise
    const clerk = await clerkClient();
    const users = await clerk.users.getUserList();

    console.log("Raw users data:", users); // Debug log

    if (!users || !users.data || users.data.length === 0) {
      console.log("No users found in Clerk"); // Debug log
      return { success: true, data: [] };
    }

    // Transform the data to match our User type
    const transformedUsers = users.data.map((user) => ({
      id: user.id,
      name:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username ||
        "Unknown",
      email: user.emailAddresses[0]?.emailAddress || "",
      role: "user", // Default role
      createdAt: user.createdAt.toString(), // Convert to string to match User type
    }));

    console.log("Transformed users:", transformedUsers); // Debug log
    return { success: true, data: transformedUsers };
  } catch (error) {
    console.error("Error in getUsers:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
      data: [],
    };
  }
}

export async function getUser(id: string) {
  try {
    const authResult = await auth();

    // Return null if user is not authenticated
    if (!authResult.userId) {
      return null;
    }

    // For now, return a mock user
    return {
      id,
      name: "User",
      email: "user@example.com",
      role: "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Return null on error
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  role: string;
}) {
  try {
    const clerk = await clerkClient();
    const result = await clerk.users.createUser({
      firstName: data.name.split(" ")[0],
      lastName: data.name.split(" ").slice(1).join(" "),
      emailAddress: [data.email],
      publicMetadata: {
        role: data.role,
      },
    });
    revalidatePath("/users");
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    role?: string;
  },
) {
  try {
    const authResult = await auth();

    // Return null if user is not authenticated
    if (!authResult.userId) {
      return null;
    }

    // In a real implementation, you would update the user's metadata in Clerk
    // For now, just return the updated data
    return {
      id,
      name: data.name || "User",
      email: data.email || "user@example.com",
      role: data.role || "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return null; // Return null on error
  }
}

export async function deleteUser() {
  try {
    const authResult = await auth();

    // Return false if user is not authenticated
    if (!authResult.userId) {
      return false;
    }

    // In a real implementation, you would delete the user in Clerk
    revalidatePath("/users");
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false; // Return false on error
  }
}
