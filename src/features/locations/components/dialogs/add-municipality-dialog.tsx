'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MunicipalityForm } from './municipality/municipality-form';
import { createMunicipality } from '../../actions/municipalities';
import {
  getCountries,
  getCountiesByDistrict,
  getDistrictsByCountry,
  getSubCountiesByCounty,
} from '../../actions/locations';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  countryId: z.string().min(1, 'Country is required'),
  districtId: z.string().min(1, 'District is required'),
  countyId: z.string().min(1, 'County is required'),
  subCountyId: z.string().min(1, 'Sub County is required'),
});

type FormValues = z.infer<typeof formSchema>;

interface Location {
  id: string;
  name: string;
  code: string;
}

interface BaseLocation {
  id: string;
  name: string;
}

interface AddMunicipalityDialogProps {
  children: ReactNode;
  countries?: Location[];
}

export function AddMunicipalityDialog({
  children,
  countries = [],
}: AddMunicipalityDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingCounties, setIsLoadingCounties] = useState(false);
  const [isLoadingSubCounties, setIsLoadingSubCounties] = useState(false);
  const [countryList, setCountryList] = useState<Location[]>(countries);
  const [districtList, setDistrictList] = useState<Location[]>([]);
  const [countyList, setCountyList] = useState<BaseLocation[]>([]);
  const [subCountyList, setSubCountyList] = useState<BaseLocation[]>([]);

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      countryId: '',
      districtId: '',
      countyId: '',
      subCountyId: '',
    },
  });

  const countryId = form.watch('countryId');
  const districtId = form.watch('districtId');
  const countyId = form.watch('countyId');

  useEffect(() => {
    if (open && countryList.length === 0) {
      const fetchCountries = async () => {
        setIsLoadingCountries(true);
        try {
          const result = await getCountries();
          if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to load countries');
          }
          setCountryList(result.data);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to load countries';
          console.error('Error fetching countries:', error);
          toast.error(message);
          setCountryList([]);
        } finally {
          setIsLoadingCountries(false);
        }
      };

      void fetchCountries();
    }
  }, [open, countryList.length]);

  useEffect(() => {
    if (countryId) {
      const fetchDistricts = async () => {
        setIsLoadingDistricts(true);
        try {
          const result = await getDistrictsByCountry(countryId);
          if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to load districts');
          }
          setDistrictList(result.data);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to load districts';
          console.error('Error fetching districts:', error);
          toast.error(message);
          setDistrictList([]);
        } finally {
          setIsLoadingDistricts(false);
        }
      };

      void fetchDistricts();
    } else {
      setDistrictList([]);
    }
  }, [countryId]);

  useEffect(() => {
    if (districtId) {
      const fetchCounties = async () => {
        setIsLoadingCounties(true);
        try {
          const result = await getCountiesByDistrict(districtId);
          if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to load counties');
          }
          setCountyList(result.data);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to load counties';
          console.error('Error fetching counties:', error);
          toast.error(message);
          setCountyList([]);
        } finally {
          setIsLoadingCounties(false);
        }
      };

      void fetchCounties();
    } else {
      setCountyList([]);
    }
  }, [districtId]);

  useEffect(() => {
    if (countyId) {
      const fetchSubCounties = async () => {
        setIsLoadingSubCounties(true);
        try {
          const result = await getSubCountiesByCounty(countyId);
          if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to load sub counties');
          }
          setSubCountyList(result.data);
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Failed to load sub counties';
          console.error('Error fetching sub counties:', error);
          toast.error(message);
          setSubCountyList([]);
        } finally {
          setIsLoadingSubCounties(false);
        }
      };

      void fetchSubCounties();
    } else {
      setSubCountyList([]);
    }
  }, [countyId]);

  // Watch municipality name for code generation
  const municipalityName = form.watch('name');

  useEffect(() => {
    // Generate municipality code from selected locations
    const selectedCountry = countryList.find(c => c.id === countryId);
    const selectedDistrict = districtList.find(d => d.id === districtId);

    if (selectedCountry?.code && selectedDistrict?.code && municipalityName) {
      const cleanName = municipalityName
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase();
      const code = `${selectedCountry.code}-${selectedDistrict.code}-MUN-${cleanName.slice(0, 3)}`;
      form.setValue('code', code);
    }
  }, [
    countryId,
    districtId,
    municipalityName,
    countryList,
    districtList,
    form,
  ]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const result = await createMunicipality(values);

      if (!result.success) {
        throw new Error(result.error || 'Failed to add municipality');
      }

      form.reset();
      toast.success('Municipality added successfully');
      setOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to add municipality';
      console.error('Error adding municipality:', error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Municipality</DialogTitle>
          <DialogDescription>
            Add a new municipality to the system.
          </DialogDescription>
        </DialogHeader>

        <MunicipalityForm
          form={form}
          onSubmit={onSubmit}
          countryList={countryList}
          districtList={districtList}
          countyList={countyList}
          subCountyList={subCountyList}
          isLoading={
            isLoading ||
            isLoadingCountries ||
            isLoadingDistricts ||
            isLoadingCounties ||
            isLoadingSubCounties
          }
          municipalityName={form.watch('name')}
          countryCode={countryList.find(c => c.id === countryId)?.code}
          districtCode={districtList.find(d => d.id === districtId)?.code}
          onCountrySelect={() => {
            // Reset district, county, and sub county selections when country changes
            form.setValue('districtId', '');
            form.setValue('countyId', '');
            form.setValue('subCountyId', '');
            // Reset lists to trigger loading states
            setDistrictList([]);
            setCountyList([]);
            setSubCountyList([]);
          }}
          onDistrictSelect={(id: string) => {
            form.setValue('districtId', id);
            form.setValue('countyId', '');
            form.setValue('subCountyId', '');
            setCountyList([]);
            setSubCountyList([]);
          }}
          onCountySelect={(id: string) => {
            form.setValue('countyId', id);
            form.setValue('subCountyId', '');
            setSubCountyList([]);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
