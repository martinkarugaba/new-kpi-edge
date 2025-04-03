"use server";

import { db } from "@/lib/db";
import { clusters } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type CreateClusterInput = {
  name: string;
  about?: string;
  country: string;
  districts: string[];
};

export type UpdateClusterInput = Partial<CreateClusterInput> & {
  id: string;
};

export async function createCluster(data: CreateClusterInput) {
  try {
    const [cluster] = await db.insert(clusters).values(data).returning();
    revalidatePath("/dashboard/clusters");
    return { success: true, data: cluster };
  } catch (error) {
    console.error("Error creating cluster:", error);
    return { success: false, error: "Failed to create cluster" };
  }
}

export async function updateCluster(data: UpdateClusterInput) {
  try {
    const { id, ...updateData } = data;
    const [cluster] = await db
      .update(clusters)
      .set(updateData)
      .where(eq(clusters.id, id))
      .returning();
    revalidatePath("/dashboard/clusters");
    return { success: true, data: cluster };
  } catch (error) {
    console.error("Error updating cluster:", error);
    return { success: false, error: "Failed to update cluster" };
  }
}

export async function deleteCluster(id: string) {
  try {
    await db.delete(clusters).where(eq(clusters.id, id));
    revalidatePath("/dashboard/clusters");
    return { success: true };
  } catch (error) {
    console.error("Error deleting cluster:", error);
    return { success: false, error: "Failed to delete cluster" };
  }
}

export async function getCluster(id: string) {
  try {
    const [cluster] = await db
      .select()
      .from(clusters)
      .where(eq(clusters.id, id));
    return { success: true, data: cluster };
  } catch (error) {
    console.error("Error fetching cluster:", error);
    return { success: false, error: "Failed to fetch cluster" };
  }
}

type ClustersResponse =
  | {
      success: true;
      data: Array<{
        id: string;
        name: string;
        about: string | null;
        country: string;
        districts: string[];
        createdAt: Date | null;
        updatedAt: Date | null;
      }>;
    }
  | {
      success: false;
      error: string;
    };

export async function getClusters(): Promise<ClustersResponse> {
  try {
    const clustersList = await db.select().from(clusters);
    return { success: true, data: clustersList };
  } catch (error) {
    console.error("Error fetching clusters:", error);
    return { success: false, error: "Failed to fetch clusters" };
  }
}
