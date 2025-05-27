'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSubCounty } from '@/features/locations/actions/subcounties';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  getCountries,
  getDistrictsByCountry,
} from '@/features/locations/actions/locations';
import { SubCountyForm } from './subcounty/subcounty-form';
import { Country, District } from './subcounty/schema';
import { FormValues, formSchema } from './subcounty/schema';

interface AddSubCountyDialogProps {
  children: React.ReactNode;
}

interface AddSubCountyDialogProps {
  children: React.ReactNode;
  countries?: Country[];
}

export function AddSubCountyDialog({
  children,
  countries = [],
}: AddSubCountyDialogProps) {
  const router = useRouter();
  const [countryList, setCountryList] = useState<Country[]>(countries);
  const [districtList, setDistrictList] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(countries.length === 0);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      countryId: '',
      districtId: '',
    },
  });

  useEffect(() => {
    if (countries.length === 0) {
      // Fetch countries if they weren't provided
      const fetchCountries = async () => {
        try {
          const result = await getCountries();
          if (result.success && result.data) {
            setCountryList(result.data);
          } else {
            toast.error('Failed to load countries');
          }
        } catch (error) {
          console.error('Error fetching countries:', error);
          toast.error('Failed to load countries');
        } finally {
          setIsLoading(false);
        }
      };

      fetchCountries();
    }
  }, [countries]);

  // Watch for changes in countryId to fetch districts
  const countryId = form.watch('countryId');
  useEffect(() => {
    if (countryId) {
      const fetchDistricts = async () => {
        setIsLoadingDistricts(true);
        try {
          const result = await getDistrictsByCountry(countryId);
          if (result.success && result.data) {
            setDistrictList(result.data);
          } else {
            toast.error('Failed to load districts');
            setDistrictList([]);
          }
        } catch (error) {
          console.error('Error fetching districts:', error);
          toast.error('Failed to load districts');
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
      const result = await addSubCounty(values);

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      form.reset();
      toast.success('Sub County added successfully');
      setOpen(false); // Close dialog after successful submission
      router.refresh();
    } catch (error) {
      console.error('Error adding sub county:', error);
      toast.error('Failed to add sub county');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Sub County</DialogTitle>
          <DialogDescription>
            Add a new sub county to the system.
          </DialogDescription>
        </DialogHeader>
        <SubCountyForm
          form={form}
          onSubmit={onSubmit}
          countryList={countryList}
          districtList={districtList}
          isLoading={isLoading || isLoadingDistricts}
          subcountyName={form.watch('name')}
          countryCode={countryList.find(c => c.id === countryId)?.code ?? ''}
          districtCode={
            districtList.find(d => d.id === form.watch('districtId'))?.code ??
            ''
          }
          onCountrySelect={() => {
            // Reset district selection when country changes
            form.setValue('districtId', '');
            // Reset district list to trigger loading state
            setDistrictList([]);
          }}
          onDistrictSelect={id => {
            form.setValue('districtId', id);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
