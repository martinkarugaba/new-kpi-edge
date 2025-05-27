'use client';

import { ReusableDataTable } from '@/components/ui/reusable-data-table';
import { columns } from '@/features/locations/components/data-table/cities-columns';
import { AddCityDialog } from '@/features/locations/components/dialogs/add-city-dialog';
import type { City } from '@/features/locations/components/data-table/cities-columns';

interface CitiesTableProps {
  data: City[];
}

export function CitiesTable({ data }: CitiesTableProps) {
  return (
    <div className="w-full">
      <ReusableDataTable
        columns={columns}
        data={data}
        filterColumn="name"
        filterPlaceholder="Filter by name..."
        showColumnToggle={true}
        showPagination={true}
        showRowSelection={true}
        pageSize={20}
        customActions={<AddCityDialog />}
      />
    </div>
  );
}
