import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import {
  CountriesTab,
  DistrictsTab,
  CountiesTab,
  ParishesTab,
  SubCountiesTab,
  VillagesTab,
} from "@/features/locations/components/tabs";

export default async function LocationsPage() {
  return (
    <div className="container mx-auto pt-0 py-10">
      <SiteHeader title="Locations" />
      <Tabs defaultValue="countries" className="mt-6">
        <div className="flex text-lg items-center mb-4 px-4">
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="countries">
              Countries
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="districts">
              Districts
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="counties">
              Counties
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="subcounties">
              Sub-Counties
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="parishes">
              Parishes
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="villages">
              Villages
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="countries" className="space-y-4">
          <CountriesTab />
        </TabsContent>

        <TabsContent value="districts" className="space-y-4">
          <DistrictsTab />
        </TabsContent>

        <TabsContent value="counties" className="space-y-4">
          <CountiesTab />
        </TabsContent>

        <TabsContent value="subcounties" className="space-y-4">
          <SubCountiesTab />
        </TabsContent>

        <TabsContent value="parishes" className="space-y-4">
          <ParishesTab />
        </TabsContent>

        <TabsContent value="villages" className="space-y-4">
          <VillagesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
