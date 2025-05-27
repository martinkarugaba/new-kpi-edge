import { z } from 'zod';

export interface District {
  id: string;
  name: string;
  code: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}

export const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z
    .string()
    .min(1, 'Code is required')
    .max(10, 'Code must be less than 10 characters'),
  country_id: z.string().min(1, 'Country is required'),
  district_id: z.string().min(1, 'District is required'),
});

export type FormValues = z.infer<typeof formSchema>;
