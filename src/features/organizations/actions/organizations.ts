"use server";

import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  acronym: z.string().min(1, "Acronym is required"),
  clusterId: z.string().nullable(),
  project: z.string().nullable(),
  country: z.string().min(1, "Country is required"),
  district: z.string().min(1, "District is required"),
  subCounty: z.string().min(1, "Sub-county is required"),
  parish: z.string().min(1, "Parish is required"),
  village: z.string().min(1, "Village is required"),
  address: z.string().min(1, "Address is required"),
});

type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export async function createOrganization(data: CreateOrganizationInput) {
  try {
    const validatedData = createOrganizationSchema.parse(data);

    const [organization] = await db
      .insert(organizations)
      .values(validatedData)
      .returning();

    revalidatePath("/dashboard/organizations");
    return { success: true, data: organization };
  } catch (error) {
    console.error("Error creating organization:", error);
    return { success: false, error: "Failed to create organization" };
  }
}

export async function getOrganizations(clusterId?: string) {
  try {
    const orgs = await db
      .select()
      .from(organizations)
      .where(clusterId ? eq(organizations.clusterId, clusterId) : undefined);

    return { success: true, data: orgs };
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return { success: false, error: "Failed to fetch organizations" };
  }
}

export async function getOrganization(id: string) {
  try {
    const [organization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, id));

    if (!organization) {
      return { success: false, error: "Organization not found" };
    }

    return { success: true, data: organization };
  } catch (error) {
    console.error("Error fetching organization:", error);
    return { success: false, error: "Failed to fetch organization" };
  }
}

export async function updateOrganization(
  id: string,
  data: Partial<CreateOrganizationInput>,
) {
  try {
    const [organization] = await db
      .update(organizations)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, id))
      .returning();

    revalidatePath("/dashboard/organizations");
    return { success: true, data: organization };
  } catch (error) {
    console.error("Error updating organization:", error);
    return { success: false, error: "Failed to update organization" };
  }
}

export async function deleteOrganization(id: string) {
  try {
    await db.delete(organizations).where(eq(organizations.id, id));

    revalidatePath("/dashboard/organizations");
    return { success: true };
  } catch (error) {
    console.error("Error deleting organization:", error);
    return { success: false, error: "Failed to delete organization" };
  }
}
