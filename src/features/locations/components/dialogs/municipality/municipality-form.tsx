import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover } from '@/components/ui/popover';
import { Command } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { type UseFormReturn, type SubmitHandler } from 'react-hook-form';
import { useState } from 'react';

interface Country {
  id: string;
  name: string;
  code: string;
}

interface District {
  id: string;
  name: string;
  code: string;
}

interface County {
  id: string;
  name: string;
}

interface SubCounty {
  id: string;
  name: string;
}

interface FormValues {
  name: string;
  code: string;
  countryId: string;
  districtId: string;
  countyId: string;
  subCountyId: string;
}

interface MunicipalityFormProps {
  form: UseFormReturn<FormValues>;
  onSubmit: SubmitHandler<FormValues>;
  countryList: Country[];
  districtList: District[];
  countyList: County[];
  subCountyList: SubCounty[];
  isLoading: boolean;
  municipalityName: string;
  countryCode?: string;
  districtCode?: string;
  onCountrySelect?: () => void;
  onDistrictSelect?: (id: string) => void;
  onCountySelect?: (id: string) => void;
}

export function MunicipalityForm({
  form,
  onSubmit,
  countryList,
  districtList,
  countyList,
  subCountyList,
  isLoading,
  onCountrySelect,
  onDistrictSelect,
  onCountySelect,
}: MunicipalityFormProps) {
  const [openCountry, setOpenCountry] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openCounty, setOpenCounty] = useState(false);
  const [openSubCounty, setOpenSubCounty] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void form.handleSubmit(onSubmit)(e);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter municipality name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="countryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Country</FormLabel>
              <Popover open={openCountry} onOpenChange={setOpenCountry}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCountry}
                      className="w-full justify-between"
                    >
                      {field.value
                        ? countryList.find(
                            country => country.id === field.value
                          )?.name
                        : 'Select a country'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search countries..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {countryList.map(country => (
                        <CommandItem
                          value={country.name}
                          key={country.id}
                          onSelect={() => {
                            field.onChange(country.id);
                            setOpenCountry(false);
                            if (onCountrySelect) {
                              onCountrySelect();
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === country.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
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

        <FormField
          control={form.control}
          name="districtId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>District</FormLabel>
              <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDistrict}
                      className="w-full justify-between"
                      disabled={!form.watch('countryId')}
                    >
                      {field.value
                        ? districtList.find(
                            district => district.id === field.value
                          )?.name
                        : 'Select a district'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search districts..." />
                    <CommandEmpty>
                      {isLoading
                        ? 'Loading districts...'
                        : form.watch('countryId')
                          ? 'No districts found for this country.'
                          : 'Please select a country first.'}
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {districtList.map(district => (
                        <CommandItem
                          value={district.name}
                          key={district.id}
                          onSelect={() => {
                            field.onChange(district.id);
                            setOpenDistrict(false);
                            if (onDistrictSelect) {
                              onDistrictSelect(district.id);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === district.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
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

        <FormField
          control={form.control}
          name="countyId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>County</FormLabel>
              <Popover open={openCounty} onOpenChange={setOpenCounty}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCounty}
                      className="w-full justify-between"
                      disabled={!form.watch('districtId')}
                    >
                      {field.value
                        ? countyList.find(county => county.id === field.value)
                            ?.name
                        : 'Select a county'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search counties..." />
                    <CommandEmpty>
                      {isLoading
                        ? 'Loading counties...'
                        : form.watch('districtId')
                          ? 'No counties found for this district.'
                          : 'Please select a district first.'}
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {countyList.map(county => (
                        <CommandItem
                          value={county.name}
                          key={county.id}
                          onSelect={() => {
                            field.onChange(county.id);
                            setOpenCounty(false);
                            if (onCountySelect) {
                              onCountySelect(county.id);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === county.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {county.name}
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

        <FormField
          control={form.control}
          name="subCountyId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Sub County</FormLabel>
              <Popover open={openSubCounty} onOpenChange={setOpenSubCounty}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openSubCounty}
                      className="w-full justify-between"
                      disabled={!form.watch('countyId')}
                    >
                      {field.value
                        ? subCountyList.find(
                            subCounty => subCounty.id === field.value
                          )?.name
                        : 'Select a sub county'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search sub counties..." />
                    <CommandEmpty>
                      {isLoading
                        ? 'Loading sub counties...'
                        : form.watch('countyId')
                          ? 'No sub counties found for this county.'
                          : 'Please select a county first.'}
                    </CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {subCountyList.map(subCounty => (
                        <CommandItem
                          value={subCounty.name}
                          key={subCounty.id}
                          onSelect={() => {
                            field.onChange(subCounty.id);
                            setOpenSubCounty(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              field.value === subCounty.id
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {subCounty.name}
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

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code (Auto-generated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Auto-generated from location hierarchy"
                  {...field}
                  disabled={true}
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Adding...' : 'Add Municipality'}
        </Button>
      </form>
    </Form>
  );
}
