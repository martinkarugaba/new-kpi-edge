"use server";

import { signIn } from "@/features/auth/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function login(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during login",
    };
  }
}

export async function register(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "user",
      })
      .returning();

    revalidatePath("/auth/login");
    return { success: true, data: user };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during registration",
    };
  }
}
