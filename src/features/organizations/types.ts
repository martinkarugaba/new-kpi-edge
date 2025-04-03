import { Cluster } from "../clusters/components/clusters-table";

export interface Organization {
  id: string;
  name: string;
  acronym: string;
  clusterId: string | null;
  cluster?: Cluster;
  project: string | null;
  country: string;
  district: string;
  subCounty: string;
  parish: string;
  village: string;
  address: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}
