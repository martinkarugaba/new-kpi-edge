export interface Cluster {
  id: string;
  name: string;
  about: string | null;
  country: string;
  districts: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}
