"use server";

import { db } from "@/lib/db";
import { organizations, clusters, projects } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

export async function getOrganizations(cluster_id?: string) {
  try {
    const orgs = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        acronym: organizations.acronym,
        cluster_id: organizations.cluster_id,
        project_id: organizations.project_id,
        country: organizations.country,
        district: organizations.district,
        sub_county: organizations.sub_county,
        parish: organizations.parish,
        village: organizations.village,
        address: organizations.address,
        created_at: organizations.created_at,
        updated_at: organizations.updated_at,
        cluster: {
          id: clusters.id,
          name: clusters.name,
        },
        project: {
          id: projects.id,
          name: projects.name,
          acronym: projects.acronym,
        },
      })
      .from(organizations)
      .leftJoin(clusters, eq(organizations.cluster_id, clusters.id))
      .leftJoin(projects, eq(organizations.project_id, projects.id))
      .where(cluster_id ? eq(organizations.cluster_id, cluster_id) : undefined);

    // Transform the data to match the Organization interface
    const transformedOrgs = orgs.map((org) => ({
      ...org,
      project: org.project
        ? {
            id: org.project.id,
            name: org.project.name,
            acronym: org.project.acronym || "",
          }
        : null,
    }));

    return { success: true, data: transformedOrgs };
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return { success: false, error: "Failed to fetch organizations" };
  }
}

export async function getOrganization(id: string) {
  try {
    const [organization] = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        acronym: organizations.acronym,
        cluster_id: organizations.cluster_id,
        project_id: organizations.project_id,
        country: organizations.country,
        district: organizations.district,
        sub_county: organizations.sub_county,
        parish: organizations.parish,
        village: organizations.village,
        address: organizations.address,
        created_at: organizations.created_at,
        updated_at: organizations.updated_at,
        cluster: {
          id: clusters.id,
          name: clusters.name,
        },
        project: {
          id: projects.id,
          name: projects.name,
          acronym: projects.acronym,
        },
      })
      .from(organizations)
      .leftJoin(clusters, eq(organizations.cluster_id, clusters.id))
      .leftJoin(projects, eq(organizations.project_id, projects.id))
      .where(eq(organizations.id, id));

    if (!organization) {
      return { success: false, error: "Organization not found" };
    }

    // Transform the data to match the Organization interface
    const transformedOrg = {
      ...organization,
      project: organization.project
        ? {
            id: organization.project.id,
            name: organization.project.name,
            acronym: organization.project.acronym || "",
          }
        : null,
    };

    return { success: true, data: transformedOrg };
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
        updated_at: new Date(),
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

export async function deleteOrganizations(ids: string[]) {
  try {
    await db.delete(organizations).where(inArray(organizations.id, ids));

    revalidatePath("/dashboard/organizations");
    return { success: true };
  } catch (error) {
    console.error("Error deleting organizations:", error);
    return { success: false, error: "Failed to delete organizations" };
  }
}

export async function getCurrentOrganizationWithCluster(
  organizationId: string,
) {
  try {
    const [organization] = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        acronym: organizations.acronym,
        cluster_id: organizations.cluster_id,
        project_id: organizations.project_id,
        country: organizations.country,
        district: organizations.district,
        sub_county: organizations.sub_county,
        parish: organizations.parish,
        village: organizations.village,
        address: organizations.address,
        created_at: organizations.created_at,
        updated_at: organizations.updated_at,
        cluster: {
          id: clusters.id,
          name: clusters.name,
        },
        project: {
          id: projects.id,
          name: projects.name,
          acronym: projects.acronym,
        },
      })
      .from(organizations)
      .leftJoin(clusters, eq(organizations.cluster_id, clusters.id))
      .leftJoin(projects, eq(organizations.project_id, projects.id))
      .where(eq(organizations.id, organizationId));

    if (!organization) {
      return { success: false, error: "Organization not found" };
    }

    // Transform the data to match the Organization interface
    const transformedOrg = {
      ...organization,
      project: organization.project
        ? {
            id: organization.project.id,
            name: organization.project.name,
            acronym: organization.project.acronym || "",
          }
        : null,
    };

    return { success: true, data: transformedOrg };
  } catch (error) {
    console.error("Error fetching organization:", error);
    return { success: false, error: "Failed to fetch organization" };
  }
}

export async function getOrganizationsByCluster(clusterId: string) {
  try {
    const orgs = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        acronym: organizations.acronym,
        cluster_id: organizations.cluster_id,
        project_id: organizations.project_id,
        country: organizations.country,
        district: organizations.district,
        sub_county: organizations.sub_county,
        parish: organizations.parish,
        village: organizations.village,
        address: organizations.address,
        created_at: organizations.created_at,
        updated_at: organizations.updated_at,
        cluster: {
          id: clusters.id,
          name: clusters.name,
        },
        project: {
          id: projects.id,
          name: projects.name,
          acronym: projects.acronym,
        },
      })
      .from(organizations)
      .leftJoin(clusters, eq(organizations.cluster_id, clusters.id))
      .leftJoin(projects, eq(organizations.project_id, projects.id))
      .where(eq(organizations.cluster_id, clusterId));

    return { success: true, data: orgs };
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return { success: false, error: "Failed to fetch organizations" };
  }
}
