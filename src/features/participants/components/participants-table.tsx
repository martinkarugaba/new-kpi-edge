'use client';

import { useState } from 'react';
import { ReusableDataTable } from '@/components/ui/reusable-data-table';
import { type Project } from '@/features/projects/types';
import { type Organization } from '@/features/organizations/types';
import { type Participant } from '../types/types';
import { type ParticipantFormValues } from './participant-form';
import {
  AddParticipantDialog,
  BulkDeleteButton,
  getColumns,
  ParticipantTableFilters,
} from './table';
import { ImportParticipants } from './import/import-participants';

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
  projects,
  // Add filter props
  organizations,
  clusters,
  districts,
  sexOptions,
  filters,
  setFilters,
}: ParticipantsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Participant[]>([]);
  const columns = getColumns({ onEdit, onDelete });

  return (
    <div className="space-y-6">
      <div className="px-4 lg:px-6 py-2">
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
        <ReusableDataTable
          columns={columns}
          data={data}
          filterColumn="fullName"
          filterPlaceholder="Filter by name..."
          showColumnToggle={true}
          showPagination={true}
          showRowSelection={true}
          pageSize={10}
          onRowSelectionChange={setSelectedRows}
          customActions={
            <div className="flex items-center gap-2">
              <ImportParticipants
                onImport={onImportParticipants}
                clusterId={clusters[0]?.id || ''}
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
