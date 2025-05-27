import { SiteHeader } from '@/features/dashboard/components/site-header';
import { CountriesTab } from '@/features/locations/components/tabs';

export default async function LocationsPage() {
  return (
    <div className="container mx-auto pt-0 py-10">
      <SiteHeader title="Locations" />
      <div className="mt-6">
        <CountriesTab />
      </div>
    </div>
  );
}
