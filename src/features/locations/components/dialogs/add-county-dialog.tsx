"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCounty } from "@/features/locations/actions/counties";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCountries,
  getDistrictsByCountry,
} from "@/features/locations/actions/locations";
import { FormValues, formSchema } from "./county/schema";
import { District, Country } from "./county/schema";
import { CountyForm } from "./county/county-form";

interface AddCountyDialogProps {
  children: React.ReactNode;
}

export function AddCountyDialog({ children }: AddCountyDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      country_id: "",
      district_id: "",
    },
  });

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoadingCountries(true);
      try {
        const result = await getCountries();
        if (result.success && result.data) {
          setCountryList(result.data);
        } else {
          toast.error("Failed to load countries");
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries");
      } finally {
        setIsLoadingCountries(false);
      }
    };

    if (open) {
      fetchCountries();
    }
  }, [open]);

  // Watch for changes in country_id to fetch districts
  const countryId = form.watch("country_id");
  useEffect(() => {
    if (countryId) {
      const fetchDistricts = async () => {
        setIsLoadingDistricts(true);
        try {
          const result = await getDistrictsByCountry(countryId);
          if (result.success && result.data) {
            setDistrictList(result.data);
          } else {
            toast.error("Failed to load districts");
            setDistrictList([]);
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
          toast.error("Failed to load districts");
          setDistrictList([]);
        } finally {
          setIsLoadingDistricts(false);
        }
      };

      fetchDistricts();
    } else {
      setDistrictList([]);
    }
  }, [countryId]);

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true);
      const result = await addCounty(values);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      form.reset();
      toast.success("County added successfully");
      setOpen(false); // Close dialog after successful submission
      router.refresh();
    } catch (error) {
      console.error("Error adding county:", error);
      toast.error("Failed to add county");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add County</DialogTitle>
          <DialogDescription>Add a new county to the system.</DialogDescription>
        </DialogHeader>
        <CountyForm
          form={form}
          onSubmit={onSubmit}
          countryList={countryList}
          districtList={districtList}
          isLoading={isLoading || isLoadingCountries || isLoadingDistricts}
          countyName={form.watch("name")}
        />
      </DialogContent>
    </Dialog>
  );
}
