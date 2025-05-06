import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ICity, ICountry, IState } from "country-state-city";
import {
  countriesAtom,
  selectedLocationsAtom,
  currentCountryAtom,
  currentDistrictAtom,
  currentSubCountiesAtom,
  districtsAtom,
  subCountiesAtom,
  LocationSelection,
} from "../../atoms/organization-form";
import {
  getDistrictsByCountry,
  getSubCounties,
} from "@/features/locations/actions/locations";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./types";

interface LocationSelectorProps {
  form: UseFormReturn<FormValues>;
}

export function LocationSelector({ form }: LocationSelectorProps) {
  const [countries] = useAtom(countriesAtom);
  const [selectedLocations, setSelectedLocations] = useAtom(
    selectedLocationsAtom,
  );
  const [currentCountry, setCurrentCountry] = useAtom(currentCountryAtom);
  const [currentDistrict, setCurrentDistrict] = useAtom(currentDistrictAtom);
  const [currentSubCounties, setCurrentSubCounties] = useAtom(
    currentSubCountiesAtom,
  );
  const [districts, setDistricts] = useAtom(districtsAtom);
  const [subCounties, setSubCounties] = useAtom(subCountiesAtom);

  const handleCountrySelect = async (
    countryCode: string,
    countryName: string,
  ) => {
    setCurrentCountry({ code: countryCode, name: countryName });
    // Reset district and sub-counties
    setCurrentDistrict(null);
    setCurrentSubCounties([]);
    // Fetch districts for selected country
    const result = await getDistrictsByCountry(countryCode);
    if (result.success && result.data) {
      // Convert DB districts to IState format
      const convertedDistricts: IState[] = result.data.map((d) => ({
        name: d.name,
        isoCode: d.code,
        countryCode,
        latitude: "",
        longitude: "",
      }));
      setDistricts(convertedDistricts);
    }
  };

  const handleDistrictSelect = async (
    districtCode: string,
    districtName: string,
  ) => {
    setCurrentDistrict({ code: districtCode, name: districtName });
    setCurrentSubCounties([]);
    // Fetch sub-counties for selected district
    if (currentCountry) {
      // Since we don't have a specific function to get subcounties by district,
      // we'll get all subcounties and filter them manually
      const result = await getSubCounties();
      if (result.success && result.data) {
        // Filter by district code and convert to ICity format
        const filteredSubCounties = result.data.filter(
          (sc) => sc.district.code === districtCode,
        );
        const convertedSubCounties: ICity[] = filteredSubCounties.map((sc) => ({
          name: sc.name,
          stateCode: districtCode,
          countryCode: currentCountry.code,
          latitude: "",
          longitude: "",
        }));
        setSubCounties(convertedSubCounties);
      }
    }
  };

  const handleSubCountySelect = (subCountyName: string) => {
    setCurrentSubCounties((prev: string[]) =>
      prev.includes(subCountyName)
        ? prev.filter((sc: string) => sc !== subCountyName)
        : [...prev, subCountyName],
    );
  };

  const handleConfirmDistrict = () => {
    if (currentCountry && currentDistrict && currentSubCounties.length > 0) {
      setSelectedLocations((prev: LocationSelection[]) => {
        const countryIndex = prev.findIndex(
          (loc: LocationSelection) => loc.countryCode === currentCountry.code,
        );
        if (countryIndex >= 0) {
          // Add district to existing country
          const updated = [...prev];
          updated[countryIndex].districts.push({
            districtCode: currentDistrict.code,
            districtName: currentDistrict.name,
            subCounties: currentSubCounties,
          });
          return updated;
        } else {
          // Add new country with district
          return [
            ...prev,
            {
              countryCode: currentCountry.code,
              countryName: currentCountry.name,
              districts: [
                {
                  districtCode: currentDistrict.code,
                  districtName: currentDistrict.name,
                  subCounties: currentSubCounties,
                },
              ],
            },
          ];
        }
      });

      // Update form values
      form.setValue("country", [
        ...(form.getValues("country") || []),
        currentCountry.name,
      ]);
      form.setValue("district", [
        ...(form.getValues("district") || []),
        currentDistrict.name,
      ]);
      form.setValue("sub_county", [
        ...(form.getValues("sub_county") || []),
        ...currentSubCounties,
      ]);

      // Reset district and sub-counties for next selection
      setCurrentDistrict(null);
      setCurrentSubCounties([]);
    }
  };

  const handleFinishCountry = () => {
    setCurrentCountry(null);
    setCurrentDistrict(null);
    setCurrentSubCounties([]);
    setDistricts([]);
    setSubCounties([]);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Location Details</h3>
      <div className="space-y-4">
        {!currentCountry ? (
          // Country Selection
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Country</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      Select a country
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search countries..." />
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {countries.map((country: ICountry) => (
                          <CommandItem
                            key={country.isoCode}
                            onSelect={() =>
                              handleCountrySelect(country.isoCode, country.name)
                            }
                          >
                            {country.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          // District and Sub-county Selection
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                Selected Country: {currentCountry.name}
              </h4>
              <Button variant="outline" size="sm" onClick={handleFinishCountry}>
                Finish Country
              </Button>
            </div>

            {!currentDistrict ? (
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select District</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          Select a district
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search districts..." />
                          <CommandEmpty>No district found.</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-auto">
                            {districts.map((district: IState) => (
                              <CommandItem
                                key={district.isoCode}
                                onSelect={() =>
                                  handleDistrictSelect(
                                    district.isoCode,
                                    district.name,
                                  )
                                }
                              >
                                {district.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">
                    Selected District: {currentDistrict.name}
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleConfirmDistrict}
                  >
                    Confirm District
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="sub_county"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Sub-Counties</FormLabel>
                      <div className="border rounded-md p-4">
                        <div className="flex flex-wrap gap-2">
                          {subCounties.map((subCounty: ICity) => (
                            <Badge
                              key={subCounty.name}
                              variant={
                                currentSubCounties.includes(subCounty.name)
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer"
                              onClick={() =>
                                handleSubCountySelect(subCounty.name)
                              }
                            >
                              {subCounty.name}
                              {currentSubCounties.includes(subCounty.name) && (
                                <X
                                  className="ml-1 h-3 w-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSubCountySelect(subCounty.name);
                                  }}
                                />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        )}

        {/* Summary of selected locations */}
        {selectedLocations.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium">Selected Locations:</h4>
            {selectedLocations.map((location: LocationSelection) => (
              <div key={location.countryCode} className="rounded-lg border p-4">
                <h5 className="font-medium">{location.countryName}</h5>
                <div className="ml-4 mt-2 space-y-2">
                  {location.districts.map(
                    (district: {
                      districtCode: string;
                      districtName: string;
                      subCounties: string[];
                    }) => (
                      <div key={district.districtCode}>
                        <h6 className="text-sm font-medium">
                          {district.districtName}
                        </h6>
                        <div className="ml-4 flex flex-wrap gap-1">
                          {district.subCounties.map((subCounty: string) => (
                            <Badge key={subCounty} variant="secondary">
                              {subCounty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
