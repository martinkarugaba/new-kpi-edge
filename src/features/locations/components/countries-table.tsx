"use client";

import { ReusableDataTable } from "@/components/ui/reusable-data-table";
import { countries } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { countryColumns } from "@/features/locations/components/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddCountryDialog } from "@/features/locations/components/dialogs/add-country-dialog";

type Country = InferSelectModel<typeof countries>;

interface CountriesTableProps {
  data: Country[];
}

export function CountriesTable({ data }: CountriesTableProps) {
  return (
    <div className="w-full">
      <ReusableDataTable
        columns={countryColumns}
        data={data}
        filterColumn="name"
        filterPlaceholder="Filter by name..."
        showColumnToggle={true}
        showPagination={true}
        showRowSelection={true}
        pageSize={20}
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
