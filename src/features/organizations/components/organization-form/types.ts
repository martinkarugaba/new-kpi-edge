import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  acronym: z.string().min(1, "Acronym is required"),
  cluster_id: z.string().nullable(), // Keep for backward compatibility
  selected_cluster_ids: z.array(z.string()), // New field for multiple clusters
  project_id: z.string().nullable(),
  country: z.array(z.string()).min(1, "At least one country is required"),
  district: z.array(z.string()).min(1, "At least one district is required"),
  sub_county: z.array(z.string()).min(1, "At least one sub-county is required"),
  parish: z.string().min(1, "Parish is required"),
  village: z.string().min(1, "Village is required"),
  address: z.string().min(1, "Address is required"),
});

export type FormValues = z.infer<typeof formSchema>;

export interface OrganizationData {
  id: string;
  name: string;
  acronym: string;
  cluster_id: string | null;
  project_id: string | null;
  country: string;
  district: string;
  sub_county: string[]; // Changed to array
  parish: string;
  village: string;
  address: string;
}
