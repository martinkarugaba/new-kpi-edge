export interface Cluster {
  id: string;
  name: string;
  about: string | null;
  country: string;
  districts: string[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ClusterMember {
  id: string;
  cluster_id: string;
  organization_id: string;
  created_at: Date | null;
  updated_at: Date | null;
}
