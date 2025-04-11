export interface Organization {
  id: string;
  name: string;
  acronym: string;
  cluster_id: string | null;
  project_id: string | null;
  country: string;
  district: string;
  sub_county: string;
  parish: string;
  village: string;
  address: string;
  created_at: Date | null;
  updated_at: Date | null;
  cluster?: {
    id: string;
    name: string;
  } | null;
  project?: {
    id: string;
    name: string;
  } | null;
}
