import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/db";
import {
  districts,
  counties,
  subCounties,
  municipalities,
} from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { City } from "../data-table/cities-columns";
import { createCity, updateCity } from "../../actions/cities";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { eq } from "drizzle-orm";

type District = InferSelectModel<typeof districts>;
type County = InferSelectModel<typeof counties>;
type SubCounty = InferSelectModel<typeof subCounties>;
type Municipality = InferSelectModel<typeof municipalities>;

type Props = {
  editData?: City | null;
};

export function AddCityDialog({ editData }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [selectedSubCounty, setSelectedSubCounty] = useState<string>("");
  const [districtsList, setDistrictsList] = useState<District[]>([]);
  const [countiesList, setCountiesList] = useState<County[]>([]);
  const [subCountiesList, setSubCountiesList] = useState<SubCounty[]>([]);
  const [municipalitiesList, setMunicipalitiesList] = useState<Municipality[]>(
    []
  );

  useEffect(() => {
    // Fetch initial data
    async function fetchData() {
      const districtsData = await db.select().from(districts);
      setDistrictsList(districtsData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    // Listen for edit event
    const handleEditEvent = (event: CustomEvent<City>) => {
      const city = event.detail;
      if (city) {
        setOpen(true);
        setSelectedDistrict(city.district_id || "");
        setSelectedCounty(city.county_id || "");
        setSelectedSubCounty(city.sub_county_id || "");
      }
    };

    window.addEventListener("editCity", handleEditEvent as EventListener);

    return () => {
      window.removeEventListener("editCity", handleEditEvent as EventListener);
    };
  }, []);

  useEffect(() => {
    // Fetch counties when district changes
    async function fetchCounties() {
      if (selectedDistrict) {
        const countiesData = await db
          .select()
          .from(counties)
          .where(counties => {
            return selectedDistrict
              ? eq(counties.district_id, selectedDistrict)
              : undefined;
          });
        setCountiesList(countiesData);
      } else {
        setCountiesList([]);
      }
    }
    fetchCounties();
  }, [selectedDistrict]);

  useEffect(() => {
    // Fetch subcounties when county changes
    async function fetchSubCounties() {
      if (selectedCounty) {
        const subCountiesData = await db
          .select()
          .from(subCounties)
          .where(subCounties => {
            return selectedCounty
              ? eq(subCounties.county_id, selectedCounty)
              : undefined;
          });
        setSubCountiesList(subCountiesData);
      } else {
        setSubCountiesList([]);
      }
    }
    fetchSubCounties();
  }, [selectedCounty]);

  useEffect(() => {
    // Fetch municipalities when subcounty changes
    async function fetchMunicipalities() {
      if (selectedSubCounty) {
        const municipalitiesData = await db
          .select()
          .from(municipalities)
          .where(municipalities => {
            return selectedSubCounty
              ? eq(municipalities.sub_county_id, selectedSubCounty)
              : undefined;
          });
        setMunicipalitiesList(municipalitiesData);
      } else {
        setMunicipalitiesList([]);
      }
    }
    fetchMunicipalities();
  }, [selectedSubCounty]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);

      try {
        const result = editData
          ? await updateCity(editData.id, formData)
          : await createCity(formData);

        if (result.success) {
          toast.success(
            `City ${editData ? "updated" : "created"} successfully`
          );
          setOpen(false);
          form.reset();
        } else {
          toast.error(`Failed to ${editData ? "update" : "create"} city`);
        }
      } catch (error) {
        console.error(error);
        toast.error(`Failed to ${editData ? "update" : "create"} city`);
      }
    },
    [editData]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{editData ? "Edit" : "Add City"}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit" : "Add"} City</DialogTitle>
          <DialogDescription>
            {editData
              ? "Update the city details below."
              : "Add a new city by filling out the form below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input
            name="name"
            placeholder="City name"
            defaultValue={editData?.name}
            required
          />
          <Input
            name="code"
            placeholder="City code"
            defaultValue={editData?.code}
            required
          />
          <input
            type="hidden"
            name="countryId"
            value={editData?.country_id || ""}
          />
          <Select
            name="districtId"
            value={selectedDistrict}
            onValueChange={value => {
              setSelectedDistrict(value);
              setSelectedCounty("");
              setSelectedSubCounty("");
            }}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districtsList.map(district => (
                <SelectItem key={district.id} value={district.id}>
                  {district.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            name="countyId"
            value={selectedCounty}
            onValueChange={value => {
              setSelectedCounty(value);
              setSelectedSubCounty("");
            }}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select county" />
            </SelectTrigger>
            <SelectContent>
              {countiesList.map(county => (
                <SelectItem key={county.id} value={county.id}>
                  {county.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            name="subCountyId"
            value={selectedSubCounty}
            onValueChange={setSelectedSubCounty}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub-county" />
            </SelectTrigger>
            <SelectContent>
              {subCountiesList.map(subCounty => (
                <SelectItem key={subCounty.id} value={subCounty.id}>
                  {subCounty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select name="municipalityId">
            <SelectTrigger>
              <SelectValue placeholder="Select municipality (optional)" />
            </SelectTrigger>
            <SelectContent>
              {municipalitiesList.map(municipality => (
                <SelectItem key={municipality.id} value={municipality.id}>
                  {municipality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button type="submit">{editData ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
