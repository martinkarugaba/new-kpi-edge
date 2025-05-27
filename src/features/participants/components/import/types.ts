import { type ParticipantFormValues } from '../participant-form';

export interface ParsedData {
  data: ParticipantFormValues[];
  errors: string[];
  rawData: Record<string, unknown>[];
}

export interface ProcessedSheet {
  participants: ParticipantFormValues[];
  errors: string[];
}
