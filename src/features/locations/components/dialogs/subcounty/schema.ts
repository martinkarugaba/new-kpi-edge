import { z } from 'zod';

export const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string(),
  countryId: z.string().min(1, 'Country is required'),
  districtId: z.string().min(1, 'District is required'),
});

export type FormValues = z.infer<typeof formSchema>;

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface District {
  id: string;
  name: string;
  code: string;
  country_id: string;
}
