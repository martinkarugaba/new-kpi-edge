"use client";

import { useState } from "react";
import { ReusableDataTable } from "@/components/ui/reusable-data-table";
import { type Project } from "@/features/projects/types";
import { type Organization } from "@/features/organizations/types";
import { type Participant } from "../types/types";
import { type ParticipantFormValues } from "./participant-form";
import {
  AddParticipantDialog,
  BulkDeleteButton,
  getColumns,
  ParticipantTableFilters,
} from "./table";
import { ImportParticipants } from "./import/import-participants";

interface ParticipantsTableProps {
  data: Participant[];
  onEdit: (participant: Participant) => void;
  onDelete: (participant: Participant) => void;
  onAdd: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingParticipant: Participant | null;
  handleSubmit: (data: ParticipantFormValues) => Promise<void>;
  onImportParticipants: (data: ParticipantFormValues[]) => Promise<void>;
  isLoading: boolean;
  tableIsLoading?: boolean;
  tableError?: string;
  projects: Project[];
  // Add filter-related props
  organizations: Organization[];
  clusters: { id: string; name: string }[];
  districts: string[];
  sexOptions: string[];
  filters: {
    cluster: string;
    project: string;
    district: string;
    sex: string;
    isPWD: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      cluster: string;
      project: string;
      district: string;
      sex: string;
      isPWD: string;
    }>
  >;
}

export function ParticipantsTable({
  data,
  onEdit,
  onDelete,
  isOpen,
  setIsOpen,
  editingParticipant,
  handleSubmit,
  onImportParticipants,
  isLoading,
  tableIsLoading,
  tableError,
  projects,
  organizations,
  clusters,
  districts,
  sexOptions,
  filters,
  setFilters,
  // Add paginated data props
  pagination,
  onPageChange,
  onSearchChange,
  searchTerm,
}: ParticipantsTableProps & {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange: (page: number, pageSize: number) => void;
  onSearchChange: (search: string) => void;
  searchTerm: string;
}) {
  const [selectedRows, setSelectedRows] = useState<Participant[]>([]);
  const columns = getColumns({ onEdit, onDelete });

  // Create search state
  const [search, setSearch] = useState(searchTerm || "");

  // Update pagination state
  const handlePaginationChange = (page: number, pageSize: number) => {
    onPageChange(page, pageSize);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  return (
    <div className="space-y-6">
      <div className="px-4 py-2 lg:px-6">
        <ParticipantTableFilters
          organizations={organizations}
          projects={projects}
          districts={districts}
          sexOptions={sexOptions}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
      <div className="px-4 lg:px-6">
        <BulkDeleteButton
          selectedRows={selectedRows}
          onDelete={onDelete}
          onClearSelection={() => setSelectedRows([])}
        />
      </div>
      <div className="relative flex flex-col overflow-auto px-4 lg:px-6">
        {tableError ? (
          <div className="bg-destructive/10 text-destructive mb-4 rounded-md p-4 text-center">
            Error loading participants: {tableError}
          </div>
        ) : null}
        <ReusableDataTable
          columns={columns}
          data={data}
          filterColumn="fullName"
          filterPlaceholder="Filter by name..."
          showColumnToggle={true}
          showPagination={true}
          serverSidePagination
          onPaginationChange={handlePaginationChange}
          paginationData={pagination}
          isLoading={tableIsLoading || false}
          searchValue={search}
          onSearchChange={handleSearchChange}
          showRowSelection={true}
          pageSize={10}
          onRowSelectionChange={setSelectedRows}
          customActions={
            <div className="flex items-center gap-2">
              <ImportParticipants
                onImport={onImportParticipants}
                clusterId={clusters[0]?.id || ""}
                projects={projects}
              />
              <AddParticipantDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                editingParticipant={editingParticipant}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                projects={projects}
                clusters={clusters}
              />
            </div>
          }
        />
      </div>
    </div>
  );
}
