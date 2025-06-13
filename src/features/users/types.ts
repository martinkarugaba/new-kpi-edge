import { userRole } from "@/lib/db/schema";

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: (typeof userRole.enumValues)[number];
  created_at: Date;
  updated_at: Date;
};
