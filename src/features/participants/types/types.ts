import { type InferSelectModel } from "drizzle-orm";
import { type participants } from "@/lib/db/schema";

export type Participant = InferSelectModel<typeof participants> & {
  organizationName?: string;
  projectName?: string;
  clusterName?: string;
  districtName?: string;
  subCountyName?: string;
  countyName?: string;
};

export type NewParticipant = Omit<
  Participant,
  | "id"
  | "created_at"
  | "updated_at"
  | "organizationName"
  | "projectName"
  | "clusterName"
>;

export type ParticipantResponse = {
  success: boolean;
  data?: Participant;
  error?: string;
};

export type PaginatedParticipantsResponse = {
  success: boolean;
  data?: {
    data: Participant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  error?: string;
};

export type ParticipantsResponse = PaginatedParticipantsResponse;

export type CountResult = {
  count: number;
};

export type ParticipantMetrics = {
  totalParticipants: number;
  totalFemales: number;
  femalesYouth: number;
  femalesOlder: number;
  totalMales: number;
  malesYouth: number;
  malesOlder: number;
  totalPWD: number;
  pwdMale: number;
  pwdFemale: number;
};

export type ParticipantMetricsResponse = {
  success: boolean;
  data?: ParticipantMetrics;
  error?: string;
};
