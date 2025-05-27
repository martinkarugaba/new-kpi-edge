declare module '@/features/clusters/components/cluster-details' {
  export interface ClusterDetailsProps {
    cluster: {
      id: string;
      name: string;
      about: string | null;
      country: string;
      districts: string[];
      createdAt: Date;
      updatedAt: Date;
    };
  }

  export function ClusterDetails(props: ClusterDetailsProps): JSX.Element;
}
