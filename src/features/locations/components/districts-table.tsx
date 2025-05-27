'use client';

import { columns } from '@/features/locations/components/data-table/districts-columns';
import { ReusableDataTable } from '@/components/ui/reusable-data-table';
import { countries, districts } from '@/lib/db/schema';
import type { InferSelectModel } from 'drizzle-orm';
import { AddDistrictDialog } from '@/features/locations/components/dialogs/add-district-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type Country = InferSelectModel<typeof countries>;

type District = InferSelectModel<typeof districts> & {
  country?: Country;
};

interface DistrictsTableProps {
  data: District[];
}

export function DistrictsTable({ data }: DistrictsTableProps) {
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
        customActions={
          <AddDistrictDialog>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Add District</span>
              <span className="lg:hidden">Add</span>
            </Button>
          </AddDistrictDialog>
        }
      />
    </div>
  );
}
