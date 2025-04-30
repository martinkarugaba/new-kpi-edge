export interface Location {
  id: string;
  name: string;
  code: string;
  country: string;
  district: string;
  sub_county: string;
  parish: string;
  village: string;
  created_at: Date;
  updated_at: Date | null;
}
