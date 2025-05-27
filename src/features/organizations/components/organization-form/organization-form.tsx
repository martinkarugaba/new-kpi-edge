'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Combobox } from '@/components/ui/combobox';
import { Cluster } from '@/features/clusters/components/clusters-table';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type InferSelectModel } from 'drizzle-orm';
import {
  type countries,
  type districts,
  type subCounties,
} from '@/lib/db/schema';
import {
  getCountries,
  getDistricts,
  getSubCounties,
  getVillages,
  getMunicipalities,
  getCities,
  getWards,
  getDivisions,
  getParishes,
} from '@/features/locations/services/locations';
import { Project } from '@/features/projects/types';
import { getProjects } from '@/features/projects/actions/projects';
import { createOrganization } from '@/features/organizations/actions/organizations';

interface OrganizationFormProps {
  clusters: Cluster[];
  defaultClusterId?: string;
  onSuccess: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// Add type definitions
type Country = InferSelectModel<typeof countries>;
type District = InferSelectModel<typeof districts>;
type SubCounty = InferSelectModel<typeof subCounties>;

// Add type for the option with search value
// interface SearchableOption extends ComboboxOption {
//   searchValue?: string;
// }

// Add type for administrative units
// interface AdministrativeUnit {
//   code: string;
//   name: string;
//   type?: 'subcounty' | 'city' | 'municipality';
// }

export function OrganizationForm({
  clusters,
  defaultClusterId,
  onSuccess,
  isLoading,
  setIsLoading,
}: OrganizationFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subCounties, setSubCounties] = useState<
    (SubCounty & { type?: string })[]
  >([]);
  const [parishes, setParishes] = useState<{ code: string; name: string }[]>(
    []
  );
  const [villages, setVillages] = useState<{ code: string; name: string }[]>(
    []
  );
  const [municipalities, setMunicipalities] = useState<
    { code: string; name: string }[]
  >([]);
  const [cities, setCities] = useState<{ code: string; name: string }[]>([]);
  const [wards, setWards] = useState<{ code: string; name: string }[]>([]);
  const [divisions, setDivisions] = useState<{ code: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState({
    projects: false,
    locations: false,
  });

  // Fetch projects using server action
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(prev => ({ ...prev, projects: true }));
        const result = await getProjects();
        if (result.success && result.data) {
          setProjects(result.data);
        } else {
          console.error(
            'Error fetching projects:',
            result.error || 'No projects data returned'
          );
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(prev => ({ ...prev, projects: false }));
      }
    };

    fetchProjects();
  }, []);

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(prev => ({ ...prev, locations: true }));
        const allCountries = await getCountries();
        console.log('All countries loaded:', allCountries);
        setCountries(allCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(prev => ({ ...prev, locations: false }));
      }
    };

    loadCountries();
  }, []);

  // Load districts when country changes
  const handleCountryChange = async (countryCode: string) => {
    console.log(`handleCountryChange called with countryCode: ${countryCode}`);

    // Reset dependent fields for all cases
    form.setValue('district', '');
    form.setValue('sub_county_id', '');
    form.setValue('operation_sub_counties', []);
    form.setValue('parish', '');
    form.setValue('village', '');
    setDistricts([]);
    setSubCounties([]);
    setParishes([]);
    setVillages([]);

    // Only load districts if a valid country (not 'none') is selected
    if (countryCode && countryCode !== 'none') {
      console.log(`Loading districts for country ${countryCode}`);
      // Set loading state
      setLoading(prev => ({ ...prev, locations: true }));

      // Load districts for this country
      try {
        const districtsForCountry = await getDistricts(countryCode);
        console.log(
          `Districts returned for ${countryCode}:`,
          districtsForCountry
        );

        if (districtsForCountry && districtsForCountry.length > 0) {
          setDistricts(districtsForCountry);
          console.log(
            `${districtsForCountry.length} districts set for ${countryCode}`
          );
        } else {
          console.warn(`No districts found for country ${countryCode}`);
        }
      } catch (error) {
        console.error(
          `Error fetching districts for country ${countryCode}:`,
          error
        );
      } finally {
        setLoading(prev => ({ ...prev, locations: false }));
      }
    } else {
      console.log('No valid country code provided, skipping district loading');
    }
  };

  // Load sub-counties when district changes
  const handleDistrictChange = async (
    districtCode: string,
    countryCode: string
  ) => {
    console.log(
      `handleDistrictChange called with districtCode: ${districtCode}, countryCode: ${countryCode}`
    );

    // Set the form value
    form.setValue('district', districtCode);

    // Reset dependent fields
    form.setValue('sub_county_id', '');
    form.setValue('operation_sub_counties', []);
    setSubCounties([]);
    setParishes([]);
    setVillages([]);

    // Set loading state
    setLoading(prev => ({ ...prev, locations: true }));

    try {
      // Fetch all administrative units for this district
      const [subCountiesForDistrict, municipalitiesForDistrict] =
        await Promise.all([
          getSubCounties(countryCode, districtCode),
          getMunicipalities(districtCode),
        ]);

      // Combine administrative units into a single array with type information
      const combinedUnits = [
        ...(subCountiesForDistrict as SubCounty[]).map(unit => ({
          ...unit,
          type: 'subcounty' as const,
        })),
        ...(municipalitiesForDistrict as SubCounty[]).map(unit => ({
          ...unit,
          type: 'municipality' as const,
        })),
      ];

      console.log(`Combined administrative units:`, combinedUnits);
      setSubCounties(combinedUnits);
    } catch (error) {
      console.error(
        `Error fetching administrative units for district ${districtCode}:`,
        error
      );
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  };

  const handleSubCountyChange = async (
    unitCode: string,
    unitName: string,
    unitType: string
  ) => {
    console.log(
      `handleSubCountyChange called with unitCode: ${unitCode}, name: ${unitName}, type: ${unitType}`
    );

    if (!unitCode || unitCode === 'none') {
      console.log('No valid unit code provided, skipping data fetch');
      return;
    }

    // Reset dependent fields
    form.setValue('parish', '');
    form.setValue('village', '');
    form.setValue('municipality_id', '');
    form.setValue('city_id', '');
    form.setValue('ward_id', '');
    form.setValue('division_id', '');
    setParishes([]);
    setVillages([]);
    setMunicipalities([]);
    setCities([]);
    setWards([]);
    setDivisions([]);

    // Set loading state
    setLoading(prev => ({ ...prev, locations: true }));

    try {
      if (unitType === 'subcounty') {
        // For sub-counties, fetch parishes
        const parishesForSubCounty = await getParishes(unitCode, unitName);
        setParishes(parishesForSubCounty);
      } else if (unitType === 'city') {
        // For cities, fetch wards and divisions
        const [wardsForCity, divisionsForCity] = await Promise.all([
          getWards(unitCode),
          getDivisions(unitCode),
        ]);
        setWards(wardsForCity);
        setDivisions(divisionsForCity);
      } else if (unitType === 'municipality') {
        // For municipalities, fetch cities, wards, and divisions
        const [
          citiesForMunicipality,
          wardsForMunicipality,
          divisionsForMunicipality,
        ] = await Promise.all([
          getCities(unitCode),
          getWards(unitCode),
          getDivisions(unitCode),
        ]);
        setCities(citiesForMunicipality);
        setWards(wardsForMunicipality);
        setDivisions(divisionsForMunicipality);
      }
    } catch (error) {
      console.error(`Error fetching data for ${unitType} ${unitCode}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  };

  const handleMunicipalityChange = async (municipalityId: string) => {
    console.log(
      `handleMunicipalityChange called with municipalityId: ${municipalityId}`
    );

    if (!municipalityId || municipalityId === 'none') {
      console.log('No valid municipality ID provided, skipping data fetch');
      return;
    }

    // Reset dependent fields
    form.setValue('city_id', '');
    form.setValue('ward_id', '');
    form.setValue('division_id', '');
    setCities([]);
    setWards([]);
    setDivisions([]);

    // Set loading state
    setLoading(prev => ({ ...prev, locations: true }));

    try {
      // Fetch cities for municipality
      const citiesForMunicipality = await getCities(
        municipalityId // Using the municipality code directly
      );
      setCities(citiesForMunicipality);

      // Fetch wards for municipality
      const wardsForMunicipality = await getWards(
        municipalityId // Using the municipality code directly
      );
      setWards(wardsForMunicipality);
    } catch (error) {
      console.error(
        `Error fetching data for municipality ${municipalityId}:`,
        error
      );
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  };

  const handleCityChange = async (cityId: string) => {
    console.log(`handleCityChange called with cityId: ${cityId}`);

    if (!cityId || cityId === 'none') {
      console.log('No valid city ID provided, skipping data fetch');
      return;
    }

    // Reset dependent fields
    form.setValue('ward_id', '');
    form.setValue('division_id', '');
    setWards([]);
    setDivisions([]);

    // Set loading state
    setLoading(prev => ({ ...prev, locations: true }));

    try {
      // Fetch wards for city directly using the city code
      const wardsForCity = await getWards(
        cityId // Using the city code directly
      );
      setWards(wardsForCity);
    } catch (error) {
      console.error(`Error fetching data for city ${cityId}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  };

  const handleWardChange = async (wardId: string) => {
    console.log(`handleWardChange called with wardId: ${wardId}`);

    if (!wardId || wardId === 'none') {
      console.log('No valid ward ID provided, skipping data fetch');
      return;
    }

    // Reset dependent fields
    form.setValue('division_id', '');
    setDivisions([]);

    // Set loading state
    setLoading(prev => ({ ...prev, locations: true }));

    try {
      // Fetch divisions for ward directly using the ward code
      const divisionsForWard = await getDivisions(
        wardId // Using ward code directly - all other params are inferred from this
      );
      setDivisions(divisionsForWard);
    } catch (error) {
      console.error(`Error fetching data for ward ${wardId}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  };

  const handleParishChange = async (parishCode: string, parishName: string) => {
    console.log(
      `handleParishChange called with parishCode: ${parishCode}, name: ${parishName}`
    );

    // Reset villages
    form.setValue('village', '');
    setVillages([]);

    // Set loading state
    setLoading(prev => ({ ...prev, locations: true }));

    try {
      console.log(`Fetching villages for parish: ${parishCode}`);
      const villagesForParish = await getVillages(parishCode);
      console.log(`Villages returned:`, villagesForParish);
      setVillages(villagesForParish);
    } catch (error) {
      console.error(`Error fetching villages for parish ${parishCode}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, locations: false }));
    }
  };

  // Initialize form with default values
  // const defaultValues = {
  //   name: '',
  //   acronym: '',
  //   cluster_id: defaultClusterId || '',
  //   project_id: null,
  //   country: '',
  //   district: '',
  //   sub_county_id: '',
  //   municipality_id: '',
  //   city_id: '',
  //   ward_id: '',
  //   division_id: '',
  //   operation_sub_counties: [],
  //   parish: '',
  //   village: '',
  //   address: '',
  // };

  // Define form schema with required and optional fields
  const formSchema = z.object({
    name: z.string().min(2, { message: 'Organization name is required' }),
    acronym: z.string().min(1, { message: 'Acronym is required' }),
    cluster_id: z.string().min(1, { message: 'Please select a cluster' }),
    project_id: z.string().nullable(),
    country: z.string().min(1, { message: 'Country is required' }),
    district: z.string().min(1, { message: 'District is required' }),
    sub_county_id: z
      .string()
      .min(1, { message: 'Organization subcounty is required' }),
    municipality_id: z.string().optional(),
    city_id: z.string().optional(),
    ward_id: z.string().optional(),
    division_id: z.string().optional(),
    operation_sub_counties: z.array(z.string()).default([]),
    parish: z.string().optional(),
    village: z.string().optional(),
    address: z.string().min(1, { message: 'Address is required' }),
  });

  // Infer form values type from schema
  type FormValues = z.infer<typeof formSchema>;

  // Initialize form with default values that match the schema
  const defaultFormValues = {
    name: '',
    acronym: '',
    cluster_id: defaultClusterId || '',
    project_id: 'none',
    country: '',
    district: '',
    sub_county_id: '', // Will be validated before submission
    municipality_id: '',
    city_id: '',
    ward_id: '',
    division_id: '',
    operation_sub_counties: [], // Required by server action
    parish: '',
    village: '',
    address: '',
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const onSubmit = async (values: FormValues) => {
    console.log('Form values being submitted:', values);

    // Transform project_id to null if it's 'none' or to undefined if empty
    if (values.project_id === 'none' || values.project_id === '') {
      values.project_id = null;
    }

    // Make sure country is not 'none'
    if (values.country === 'none') {
      // This should be caught by the schema validation already
      form.setError('country', {
        message: 'Country is required',
      });
      return;
    }

    // Make sure sub_county_id is not empty or 'none'
    if (!values.sub_county_id || values.sub_county_id === 'none') {
      form.setError('sub_county_id', {
        message: 'Organization subcounty is required',
      });
      return;
    }

    // Ensure country is using the country code not name
    const countryName = values.country;
    const countryMatch = countries.find(
      c => c.name === countryName || c.code === countryName
    );
    if (countryMatch) {
      console.log(
        `Converting country from "${values.country}" to code "${countryMatch.code}"`
      );
      values.country = countryMatch.code;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use server action to create the organization instead of fetch API
      // Prepare data to match the CreateOrganizationInput type
      const organizationData = {
        ...values,
        sub_county_id: values.sub_county_id,
        operation_sub_counties: values.operation_sub_counties || [],
      };

      const result = await createOrganization(organizationData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create organization');
      }

      router.refresh();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acronym"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Acronym <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter acronym" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="cluster_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Cluster <span className="text-red-500">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cluster" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clusters.map(cluster => (
                      <SelectItem key={cluster.id} value={cluster.id}>
                        {cluster.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Project (optional)</FormLabel>
                <FormControl>
                  <Combobox
                    options={[
                      { value: 'none', label: 'No Project' },
                      ...projects.map(project => ({
                        value: project.id,
                        label: project.acronym || project.name,
                      })),
                    ]}
                    value={field.value || ''}
                    onValueChange={value => {
                      console.log('Project selected:', value);
                      field.onChange(value);
                    }}
                    placeholder="Search and select a project"
                    emptyMessage="No matching projects found"
                    disabled={loading.projects}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Location Information */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Location Information</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Country <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={[
                        { value: 'none', label: 'Select a country' },
                        ...countries.map(country => ({
                          value: country.code,
                          label: country.name,
                        })),
                      ]}
                      value={field.value || ''}
                      onValueChange={value => {
                        console.log(
                          'Country selected:',
                          value,
                          'Label:',
                          countries.find(c => c.code === value)?.name ||
                            'Select a country'
                        );
                        field.onChange(value);
                        handleCountryChange(value);
                      }}
                      placeholder="Select a country"
                      emptyMessage="No matching countries found"
                      disabled={loading.locations}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    District <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      options={[
                        { value: 'none', label: 'Select a district' },
                        ...districts.map(district => ({
                          value: district.code,
                          label: district.name,
                        })),
                      ]}
                      value={field.value || ''}
                      onValueChange={value => {
                        field.onChange(value);
                        const countryCode = form.getValues('country');
                        if (countryCode && countryCode !== 'none') {
                          handleDistrictChange(value, countryCode);
                        }
                      }}
                      placeholder={
                        districts.length > 0
                          ? 'Select a district'
                          : form.getValues('country') &&
                              form.getValues('country') !== 'none'
                            ? `No districts available for ${form.getValues('country')}`
                            : 'Select a country first'
                      }
                      emptyMessage="No matching districts found"
                      disabled={
                        !form.getValues('country') ||
                        form.getValues('country') === 'none' ||
                        (form.getValues('country') && districts.length === 0) ||
                        loading.locations
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sub-counties fields - 2 column layout */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Sub-county location field */}
            <FormField
              control={form.control}
              name="sub_county_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Location (Optional)</FormLabel>
                  <FormControl>
                    <Combobox
                      options={[
                        { value: 'none', label: 'Select a location' },
                        ...subCounties.map(unit => ({
                          value: unit.code,
                          label: `${unit.name} (${unit.type})`,
                        })),
                      ]}
                      value={field.value || ''}
                      onValueChange={value => {
                        field.onChange(value);
                        const unit = subCounties.find(s => s.code === value);
                        if (unit) {
                          handleSubCountyChange(
                            unit.code,
                            unit.name,
                            unit.type || 'subcounty'
                          );
                        }
                      }}
                      placeholder={
                        subCounties.length > 0
                          ? 'Select location'
                          : 'Select a district first'
                      }
                      emptyMessage="No matching locations found"
                      disabled={subCounties.length === 0 || loading.locations}
                    />
                  </FormControl>
                  <FormDescription>
                    The location where this organization is physically located
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Operation sub-counties field */}
            <FormField
              control={form.control}
              name="operation_sub_counties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Operation Sub Counties</FormLabel>
                  <FormControl>
                    <Combobox
                      options={[
                        {
                          value: 'none',
                          label: 'Select operation sub-counties',
                        },
                        ...subCounties.map(subCounty => ({
                          value: subCounty.code,
                          label: subCounty.name,
                        })),
                      ]}
                      value={
                        field.value && field.value.length > 0
                          ? field.value[0]
                          : ''
                      }
                      onValueChange={value => {
                        const currentValues = field.value || [];
                        const updatedValues = currentValues.includes(value)
                          ? currentValues.filter((v: string) => v !== value)
                          : [...currentValues, value];
                        field.onChange(updatedValues);
                      }}
                      placeholder={
                        subCounties.length > 0
                          ? field.value && field.value.length > 0
                            ? `${field.value.length} sub-counties selected`
                            : 'Select operation sub-counties'
                          : 'Select a district first'
                      }
                      emptyMessage="No matching sub-counties found"
                      disabled={subCounties.length === 0 || loading.locations}
                    />
                  </FormControl>
                  <FormDescription className="flex flex-wrap gap-2 mt-2">
                    <span className="mr-1">Selected:</span>
                    {Array.isArray(field.value) && field.value.length > 0
                      ? field.value
                          .map((id: string) => {
                            const sc = subCounties.find(s => s.code === id);
                            return sc ? sc.name : '';
                          })
                          .join(', ')
                      : 'None'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Municipalities and Cities - Only show if sub-county has municipalities */}
          {municipalities.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="municipality_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Municipality</FormLabel>
                    <FormControl>
                      <Combobox
                        options={[
                          { value: 'none', label: 'Select a municipality' },
                          ...municipalities.map(municipality => ({
                            value: municipality.code,
                            label: municipality.name,
                          })),
                        ]}
                        value={field.value || ''}
                        onValueChange={value => {
                          field.onChange(value);
                          handleMunicipalityChange(value);
                        }}
                        placeholder={
                          municipalities.length > 0
                            ? 'Select a municipality'
                            : 'No municipalities available'
                        }
                        emptyMessage="No matching municipalities found"
                        disabled={
                          municipalities.length === 0 || loading.locations
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Combobox
                        options={[
                          { value: 'none', label: 'Select a city' },
                          ...cities.map(city => ({
                            value: city.code,
                            label: city.name,
                          })),
                        ]}
                        value={field.value || ''}
                        onValueChange={value => {
                          field.onChange(value);
                          handleCityChange(value);
                        }}
                        placeholder={
                          cities.length > 0
                            ? 'Select a city'
                            : 'No cities available'
                        }
                        emptyMessage="No matching cities found"
                        disabled={cities.length === 0 || loading.locations}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Wards and Divisions - Only show if municipality or city is selected */}
          {(form.getValues('municipality_id') || form.getValues('city_id')) && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="ward_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ward</FormLabel>
                    <FormControl>
                      <Combobox
                        options={[
                          { value: 'none', label: 'Select a ward' },
                          ...wards.map(ward => ({
                            value: ward.code,
                            label: ward.name,
                          })),
                        ]}
                        value={field.value || ''}
                        onValueChange={value => {
                          field.onChange(value);
                          handleWardChange(value);
                        }}
                        placeholder={
                          wards.length > 0
                            ? 'Select a ward'
                            : 'No wards available'
                        }
                        emptyMessage="No matching wards found"
                        disabled={wards.length === 0 || loading.locations}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="division_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Division</FormLabel>
                    <FormControl>
                      <Combobox
                        options={[
                          { value: 'none', label: 'Select a division' },
                          ...divisions.map(division => ({
                            value: division.code,
                            label: division.name,
                          })),
                        ]}
                        value={field.value || ''}
                        onValueChange={field.onChange}
                        placeholder={
                          divisions.length > 0
                            ? 'Select a division'
                            : 'No divisions available'
                        }
                        emptyMessage="No matching divisions found"
                        disabled={divisions.length === 0 || loading.locations}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Parishes and Villages - Only show for sub-counties */}
          {form.getValues('sub_county_id') &&
            subCounties.find(s => s.code === form.getValues('sub_county_id'))
              ?.type === 'subcounty' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="parish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parish</FormLabel>
                      <FormControl>
                        <Combobox
                          options={[
                            { value: 'none', label: 'Select a parish' },
                            ...parishes.map(parish => ({
                              value: parish.code,
                              label: parish.name,
                            })),
                          ]}
                          value={field.value || ''}
                          onValueChange={value => {
                            field.onChange(value);
                            const parishObj = parishes.find(
                              p => p.code === value
                            );
                            if (parishObj) {
                              handleParishChange(
                                parishObj.code,
                                parishObj.name
                              );
                            }
                          }}
                          placeholder={
                            parishes.length > 0
                              ? 'Select a parish'
                              : 'No parishes available'
                          }
                          emptyMessage="No matching parishes found"
                          disabled={parishes.length === 0 || loading.locations}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="village"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Village</FormLabel>
                      <FormControl>
                        <Combobox
                          options={[
                            { value: 'none', label: 'Select a village' },
                            ...villages.map(village => ({
                              value: village.code,
                              label: village.name,
                            })),
                          ]}
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder={
                            villages.length > 0
                              ? 'Select a village'
                              : form.getValues('parish')
                                ? 'No villages available'
                                : 'Select a parish first'
                          }
                          emptyMessage="No matching villages found"
                          disabled={
                            !form.getValues('parish') || loading.locations
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

          {/* Cities, Wards, and Divisions - Only show for cities and municipalities */}
          {form.getValues('sub_county_id') &&
            ['city', 'municipality'].includes(
              subCounties.find(s => s.code === form.getValues('sub_county_id'))
                ?.type || ''
            ) && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Cities - Only show for municipalities */}
                {subCounties.find(
                  s => s.code === form.getValues('sub_county_id')
                )?.type === 'municipality' && (
                  <FormField
                    control={form.control}
                    name="city_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Combobox
                            options={[
                              { value: 'none', label: 'Select a city' },
                              ...cities.map(city => ({
                                value: city.code,
                                label: city.name,
                              })),
                            ]}
                            value={field.value || ''}
                            onValueChange={value => {
                              field.onChange(value);
                              handleCityChange(value);
                            }}
                            placeholder={
                              cities.length > 0
                                ? 'Select a city'
                                : 'No cities available'
                            }
                            emptyMessage="No matching cities found"
                            disabled={cities.length === 0 || loading.locations}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Wards */}
                <FormField
                  control={form.control}
                  name="ward_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ward</FormLabel>
                      <FormControl>
                        <Combobox
                          options={[
                            { value: 'none', label: 'Select a ward' },
                            ...wards.map(ward => ({
                              value: ward.code,
                              label: ward.name,
                            })),
                          ]}
                          value={field.value || ''}
                          onValueChange={value => {
                            field.onChange(value);
                            handleWardChange(value);
                          }}
                          placeholder={
                            wards.length > 0
                              ? 'Select a ward'
                              : 'No wards available'
                          }
                          emptyMessage="No matching wards found"
                          disabled={wards.length === 0 || loading.locations}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Divisions */}
                <FormField
                  control={form.control}
                  name="division_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division</FormLabel>
                      <FormControl>
                        <Combobox
                          options={[
                            { value: 'none', label: 'Select a division' },
                            ...divisions.map(division => ({
                              value: division.code,
                              label: division.name,
                            })),
                          ]}
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder={
                            divisions.length > 0
                              ? 'Select a division'
                              : 'No divisions available'
                          }
                          emptyMessage="No matching divisions found"
                          disabled={divisions.length === 0 || loading.locations}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Physical Address <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter physical address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-between gap-3">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Organization'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
