import { useState } from "react";
import { useParticipants } from "../../hooks/use-participants";
import { type QueryParams, type ParticipantFilters } from "./types";

interface UseParticipantDataProps {
  clusterId: string;
}

export function useParticipantData({ clusterId }: UseParticipantDataProps) {
  // Filtering and pagination state
  const [filters, setFilters] = useState<ParticipantFilters>({
    cluster: "",
    project: "",
    district: "",
    sex: "",
    isPWD: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Wrap setFilters to reset pagination when filters change
  const handleFilterChange = (
    newFiltersOrUpdater: React.SetStateAction<typeof filters>
  ) => {
    setFilters(newFiltersOrUpdater);
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Handle pagination changes
  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  // Handle search changes
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Prepare query parameters including filters
  const queryParams: QueryParams = {
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
    filters: {
      project: filters.project,
      district: filters.district,
      sex: filters.sex,
      isPWD: filters.isPWD,
    },
  };

  // Fetch participants data
  const { data: participantsResult, isLoading: isLoadingParticipants } =
    useParticipants(clusterId, queryParams);

  // Extract data for components
  const participantsData = participantsResult?.data?.data || [];
  const districts = Array.from(new Set(participantsData.map(p => p.district)))
    .filter(Boolean)
    .sort();
  const sexOptions = Array.from(
    new Set(participantsData.map(p => p.sex))
  ).filter(Boolean);

  return {
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
  };
}
