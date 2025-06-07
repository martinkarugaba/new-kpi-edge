"use client";

import { useState } from "react";
import { type Participant } from "../../types/types";
import { ParticipantsTable } from "../participants-table";
import { ParticipantMetrics } from "../metrics/participant-metrics";
import { useParticipantData } from "./participant-data-provider";
import { useParticipantFormHandlers } from "./participant-form-handlers";
import { extractClusterOrganizations } from "./participant-transformer";
import { type ParticipantContainerProps } from "./types";

export function ParticipantContainer({
  clusterId,
  projects,
  clusters,
}: ParticipantContainerProps) {
  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);

  // Get participant data and related state
  const {
    participantsData,
    isLoadingParticipants,
    participantsResult,
    filters,
    handleFilterChange,
    handlePageChange,
    handleSearchChange,
    searchTerm,
    districts,
    sexOptions,
  } = useParticipantData({ clusterId });

  // Get form handling functions
  const {
    handleSubmit,
    handleImportParticipants,
    handleEdit,
    handleDelete,
    handleAdd,
  } = useParticipantFormHandlers({
    clusterId,
    onSetIsLoading: setIsLoading,
    onSetIsOpen: setIsOpen,
    onSetEditingParticipant: setEditingParticipant,
  });

  // Get organizations data
  const clusterOrganizations = extractClusterOrganizations(clusterId, clusters);

  return (
    <div className="container mx-auto py-10">
      <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <ParticipantMetrics
          participants={participantsData}
          isLoading={isLoadingParticipants}
        />
      </div>

      <ParticipantsTable
        data={participantsData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingParticipant={editingParticipant}
        handleSubmit={handleSubmit}
        onImportParticipants={handleImportParticipants}
        isLoading={isLoading || isLoadingParticipants}
        tableIsLoading={isLoadingParticipants}
        tableError={
          !participantsResult?.success ? participantsResult?.error : ""
        }
        projects={projects}
        organizations={clusterOrganizations}
        clusters={clusters}
        districts={districts}
        sexOptions={sexOptions}
        filters={filters}
        setFilters={handleFilterChange}
        pagination={participantsResult?.data?.pagination}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
      />
    </div>
  );
}
