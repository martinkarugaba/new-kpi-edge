"use server";

import { db } from "@/lib/db";
import { clusterMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  createOrganization as originalCreate,
  updateOrganization as originalUpdate,
} from "./organizations";
import { z } from "zod";

// Import the schema from the organizations.ts file
const createOrganizationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  acronym: z.string().min(1, "Acronym is required"),
  cluster_id: z.string().nullable(),
  project_id: z.string().nullable(),
  country: z.string().min(1, "Country is required"),
  district: z.string().min(1, "District is required"),
  sub_county: z.array(z.string()).min(1, "At least one sub-county is required"),
  parish: z.string().min(1, "Parish is required"),
  village: z.string().min(1, "Village is required"),
  address: z.string().min(1, "Address is required"),
});

type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export async function createOrganizationWithClusters(
  data: CreateOrganizationInput,
  selectedClusterIds: string[] = [],
) {
  try {
    // Validate the input data
    const validationResult = createOrganizationSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors.map((e) => e.message).join(", "),
      };
    }

    // First create the organization using the existing function
    const result = await originalCreate(validationResult.data);

    if (!result.success || !result.data) {
      return result;
    }

    const organizationId = result.data.id;

    // Now add the organization to all selected clusters
    if (selectedClusterIds.length > 0) {
      try {
        // Add to multiple clusters via the clusterMembers junction table
        await db.insert(clusterMembers).values(
          selectedClusterIds.map((clusterId) => ({
            cluster_id: clusterId,
            organization_id: organizationId,
          })),
        );
      } catch (error) {
        console.error("Error adding organization to clusters:", error);
        // We don't want to fail the whole operation if cluster assignment fails
      }
    }

    revalidatePath("/dashboard/organizations");
    return result;
  } catch (error) {
    console.error("Error creating organization with clusters:", error);
    return { success: false, error: "Failed to create organization" };
  }
}

export async function updateOrganizationWithClusters(
  id: string,
  data: CreateOrganizationInput,
  selectedClusterIds: string[] = [],
) {
  try {
    // Validate the input data
    const validationResult = createOrganizationSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.errors.map((e) => e.message).join(", "),
      };
    }

    // First update the organization using the existing function
    const result = await originalUpdate(id, validationResult.data);

    if (!result.success) {
      return result;
    }

    // Now update the cluster memberships
    try {
      // First, remove all existing memberships
      await db
        .delete(clusterMembers)
        .where(eq(clusterMembers.organization_id, id));

      // Then add the new memberships
      if (selectedClusterIds.length > 0) {
        await db.insert(clusterMembers).values(
          selectedClusterIds.map((clusterId) => ({
            cluster_id: clusterId,
            organization_id: id,
          })),
        );
      }
    } catch (error) {
      console.error("Error updating organization clusters:", error);
      // We don't want to fail the whole operation if cluster assignment fails
    }

    revalidatePath("/dashboard/organizations");
    revalidatePath(`/dashboard/organizations/${id}`);

    return result;
  } catch (error) {
    console.error("Error updating organization with clusters:", error);
    return { success: false, error: "Failed to update organization" };
  }
}
