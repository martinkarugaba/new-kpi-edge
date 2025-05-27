'use client';

import * as React from 'react';
import { ReusableDataTable } from '@/components/ui/reusable-data-table';
import { countries } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { countryColumns } from '@/features/locations/components/data-table';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddCountryDialog } from '@/features/locations/components/dialogs/add-country-dialog';
import { useRouter } from 'next/navigation';

type Country = InferSelectModel<typeof countries>;

interface CountriesTableProps {
  data: Country[];
}

export function CountriesTable({ data }: CountriesTableProps) {
  const router = useRouter();

  const handleRowClick = (countryId: string) => {
    router.push(`/dashboard/locations/${countryId}`);
  };

  // Use the original columns without modifying them
  // The row click will be handled by the onRowClick prop
  const tableColumns = React.useMemo(() => {
    return countryColumns;
  }, []);

  return (
    <div className="w-full">
      <ReusableDataTable
        columns={tableColumns}
        data={data}
        filterColumn="name"
        filterPlaceholder="Filter by name..."
        showColumnToggle={true}
        showPagination={true}
        showRowSelection={true}
        pageSize={20}
        onRowClick={row => handleRowClick(row.id)}
        customActions={
          <AddCountryDialog>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Add Country</span>
              <span className="lg:hidden">Add</span>
            </Button>
          </AddCountryDialog>
        }
      />
    </div>
  );
}
