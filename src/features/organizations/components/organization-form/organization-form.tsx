"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { getAllCountries, getDistricts, getSubCounties } from "@/lib/locations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { Cluster } from "@/features/clusters/types";
import { Project } from "@/features/projects/types";
import { getProjects } from "@/features/projects/actions/projects";
import { useAtom } from "jotai";
import {
  countriesAtom,
  districtsAtom,
  subCountiesAtom,
  currentCountryAtom,
  currentDistrictAtom,
  districtSubCountiesAtom,
} from "../../atoms/organization-form";
import {
  createOrganizationWithClusters,
  updateOrganizationWithClusters,
} from "../../actions/organization-with-clusters";
import { BasicInformation } from "./basic-information";
import { LocationDetails } from "./location-details";
import { AddressInformation } from "./address-information";
import { formSchema, OrganizationData, FormValues } from "./types";

interface OrganizationFormProps {
  initialData?: OrganizationData;
  clusters: Cluster[];
  defaultClusterId?: string;
  onSuccess?: () => void;
  isLoading?: boolean;
  setIsLoading?: (loading: boolean) => void;
}

export function OrganizationForm({
  initialData,
  clusters,
  defaultClusterId,
  onSuccess,
  isLoading = false,
  setIsLoading,
}: OrganizationFormProps) {
  const router = useRouter();
  const [countries, setCountries] = useAtom(countriesAtom);
  const [districts, setDistricts] = useAtom(districtsAtom);
  const [availableSubCounties, setAvailableSubCounties] =
    useAtom(subCountiesAtom);
  const [currentCountry, setCurrentCountry] = useAtom(currentCountryAtom);
  const [currentDistrict, setCurrentDistrict] = useAtom(currentDistrictAtom);
  const [districtSubCounties, setDistrictSubCounties] = useAtom(
    districtSubCountiesAtom,
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedClusterIds, setSelectedClusterIds] = useState<string[]>(
    defaultClusterId ? [defaultClusterId] : [],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      acronym: initialData?.acronym || "",
      cluster_id: initialData?.cluster_id || defaultClusterId || null,
      selected_cluster_ids: selectedClusterIds,
      project_id: initialData?.project_id || null,
      country: initialData?.country ? [initialData.country] : [],
      district: initialData?.district ? [initialData.district] : [],
      sub_county: initialData?.sub_county || [],
      parish: initialData?.parish || "",
      village: initialData?.village || "",
      address: initialData?.address || "",
    },
  });

  // Fetch projects when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      const result = await getProjects();
      if (result.success && result.data) {
        setProjects(result.data || []);
      } else {
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // If initialData has a cluster_id, add it to selectedClusterIds on mount
  useEffect(() => {
    if (initialData?.cluster_id) {
      setSelectedClusterIds((prev) =>
        prev.includes(initialData.cluster_id as string)
          ? prev
          : [...prev, initialData.cluster_id as string],
      );
    }
  }, [initialData]);

  const handleCountrySelect = React.useCallback(
    (countryCode: string, countryName: string) => {
      setCurrentCountry({ code: countryCode, name: countryName });
      const countryDistricts = getDistricts(countryCode);
      setDistricts(countryDistricts);
      form.setValue("country", [countryName]);
      form.setValue("district", []);
      form.setValue("sub_county", []);
      setDistrictSubCounties({});
    },
    [form, setCurrentCountry, setDistricts, setDistrictSubCounties],
  );

  const handleDistrictSelect = useCallback(
    (districtCode: string, districtName: string) => {
      setCurrentDistrict({ code: districtCode, name: districtName });
      const currentDistricts = form.getValues("district") || [];
      if (!currentDistricts.includes(districtName)) {
        form.setValue("district", [...currentDistricts, districtName]);
      }
      const subCounties = getSubCounties(
        currentCountry?.code || "",
        districtCode,
      );
      setAvailableSubCounties(subCounties);
    },
    [currentCountry, form, setCurrentDistrict, setAvailableSubCounties],
  );

  const handleSubCountySelect = useCallback(
    (subCountyName: string) => {
      if (!currentDistrict?.code) return;

      const currentSubCounties =
        districtSubCounties[currentDistrict.code] || [];
      if (!currentSubCounties.includes(subCountyName)) {
        setDistrictSubCounties({
          ...districtSubCounties,
          [currentDistrict.code]: [...currentSubCounties, subCountyName],
        });
        const allSubCounties = form.getValues("sub_county") || [];
        form.setValue("sub_county", [...allSubCounties, subCountyName]);
      }
    },
    [currentDistrict, districtSubCounties, form, setDistrictSubCounties],
  );

  const handleFinishCountry = useCallback(() => {
    setCurrentCountry(null);
    setCurrentDistrict(null);
    setAvailableSubCounties([]);
    setDistrictSubCounties({});
  }, [
    setCurrentCountry,
    setCurrentDistrict,
    setAvailableSubCounties,
    setDistrictSubCounties,
  ]);

  const handleAddDistrict = useCallback(() => {
    setCurrentDistrict(null);
    setAvailableSubCounties([]);
  }, [setCurrentDistrict, setAvailableSubCounties]);

  // Initialize countries when component mounts
  useEffect(() => {
    const allCountries = getAllCountries();
    setCountries(allCountries);

    if (initialData?.country) {
      const country = allCountries.find((c) => c.name === initialData.country);
      if (country) {
        handleCountrySelect(country.isoCode, country.name);
      }
    }
  }, [initialData, setCountries, handleCountrySelect]);

  async function onSubmit(data: FormValues) {
    if (setIsLoading) setIsLoading(true);

    try {
      const formattedData = {
        ...data,
        country: data.country[0],
        district: data.district[0],
        sub_county: data.sub_county, // Keep this as an array
      };

      if (initialData) {
        const result = await updateOrganizationWithClusters(
          initialData.id,
          formattedData,
          selectedClusterIds,
        );

        if (!result.success) throw new Error(result.error);
        toast.success("Organization updated successfully");
      } else {
        const result = await createOrganizationWithClusters(
          formattedData,
          selectedClusterIds,
        );

        if (!result.success) throw new Error(result.error);
        toast.success("Organization created successfully");
      }

      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      if (setIsLoading) setIsLoading(false);
    }
  }

  return (
    <>
      <Toaster position="top-right" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <BasicInformation
            form={form}
            projects={projects}
            clusters={clusters}
            selectedClusterIds={selectedClusterIds}
            setSelectedClusterIds={setSelectedClusterIds}
            isLoading={isLoading}
          />

          <LocationDetails
            form={form}
            countries={countries}
            districts={districts}
            availableSubCounties={availableSubCounties}
            currentCountry={currentCountry}
            currentDistrict={currentDistrict}
            districtSubCounties={districtSubCounties}
            handleCountrySelect={handleCountrySelect}
            handleDistrictSelect={handleDistrictSelect}
            handleSubCountySelect={handleSubCountySelect}
            handleFinishCountry={handleFinishCountry}
            handleAddDistrict={handleAddDistrict}
            setDistrictSubCounties={setDistrictSubCounties}
          />

          <AddressInformation form={form} isLoading={isLoading} />

          {/* Submit button */}
          <div className="flex justify-end pt-4 border-gray-200">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 py-3 w-full cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : initialData ? (
                "Update Organization"
              ) : (
                "Create Organization"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
