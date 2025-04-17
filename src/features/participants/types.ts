import { type InferSelectModel } from "drizzle-orm";
import { type participants } from "@/lib/db/schema";

export type Participant = InferSelectModel<typeof participants>;

export type NewParticipant = Omit<
  Participant,
  "id" | "created_at" | "updated_at"
>;

export type ParticipantResponse = {
  success: boolean;
  data?: Participant;
  error?: string;
};

export type ParticipantsResponse = {
  success: boolean;
  data?: Participant[];
  error?: string;
};
