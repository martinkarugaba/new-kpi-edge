"use client";

import { columns } from "@/features/locations/components/data-table/subcounties-columns";
import { ReusableDataTable } from "@/components/ui/reusable-data-table";
import { subCounties } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { AddSubCountyDialog } from "@/features/locations/components/dialogs/add-subcounty-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type SubCounty = InferSelectModel<typeof subCounties>;

interface SubCountiesTableProps {
  data: SubCounty[];
}

export function SubCountiesTable({ data }: SubCountiesTableProps) {
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
        pageSize={10}
        customActions={
          <AddSubCountyDialog>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden lg:inline">Add Sub County</span>
              <span className="lg:hidden">Add</span>
            </Button>
          </AddSubCountyDialog>
        }
      />
    </div>
  );
}
