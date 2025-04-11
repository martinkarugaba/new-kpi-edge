"use server";

import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Project } from "../types";

const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  acronym: z.string().min(1, "Acronym is required"),
  description: z.string().nullable(),
  status: z.enum(["active", "completed", "on-hold"]).default("active"),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
});

type CreateProjectInput = z.infer<typeof createProjectSchema>;

export async function createProject(data: CreateProjectInput) {
  try {
    const validatedData = createProjectSchema.parse(data);

    const [project] = await db
      .insert(projects)
      .values(validatedData)
      .returning();

    // Cast the status field to the expected type
    const typedProject: Project = {
      ...project,
      status: project.status as "active" | "completed" | "on-hold",
    };

    revalidatePath("/dashboard/projects");
    return { success: true, data: typedProject };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(
  id: string,
  data: Partial<CreateProjectInput>,
) {
  try {
    const validatedData = createProjectSchema.partial().parse(data);

    const [project] = await db
      .update(projects)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();

    // Cast the status field to the expected type
    const typedProject: Project = {
      ...project,
      status: project.status as "active" | "completed" | "on-hold",
    };

    revalidatePath("/dashboard/projects");
    return { success: true, data: typedProject };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function getProjects() {
  try {
    const projectsList = await db.select().from(projects);

    // Cast the status field to the expected type
    const typedProjects: Project[] = projectsList.map((project) => ({
      ...project,
      status: project.status as "active" | "completed" | "on-hold",
    }));

    return { success: true, data: typedProjects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function getProject(id: string) {
  try {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id));

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Cast the status field to the expected type
    const typedProject: Project = {
      ...project,
      status: project.status as "active" | "completed" | "on-hold",
    };

    return { success: true, data: typedProject };
  } catch (error) {
    console.error("Error fetching project:", error);
    return { success: false, error: "Failed to fetch project" };
  }
}
