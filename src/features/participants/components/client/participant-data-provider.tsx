import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useParticipants } from "../../hooks/use-participants";
import { type QueryParams, type ParticipantFilters } from "./types";

interface UseParticipantDataProps {
  clusterId: string;
  initialSearchParams?: {
    page?: number;
    per_page?: number;
    search?: string;
    project?: string;
    district?: string;
    sex?: string;
    isPWD?: string;
  };
}

export function useParticipantData({
  clusterId,
  initialSearchParams,
}: UseParticipantDataProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL or props
  const getInitialPage = () =>
    initialSearchParams?.page || Number(searchParams.get("page")) || 1;
  const getInitialPerPage = () =>
    initialSearchParams?.per_page || Number(searchParams.get("per_page")) || 10;
  const getInitialSearch = () =>
    initialSearchParams?.search || searchParams.get("search") || "";

  // Filtering and pagination state
  const [filters, setFilters] = useState<ParticipantFilters>({
    cluster: "",
    project: initialSearchParams?.project || searchParams.get("project") || "",
    district:
      initialSearchParams?.district || searchParams.get("district") || "",
    sex: initialSearchParams?.sex || searchParams.get("sex") || "",
    isPWD: initialSearchParams?.isPWD || searchParams.get("isPWD") || "",
  });
  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [pageSize, setPageSize] = useState(getInitialPerPage());
  const [searchTerm, setSearchTerm] = useState(getInitialSearch());

  // Function to update URL with current filters and pagination
  const updateUrl = (params: Record<string, string | number | undefined>) => {
    const url = new URL(window.location.href);

    // Update existing params and remove any that are undefined
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      } else {
        url.searchParams.delete(key);
      }
    });

    router.push(url.pathname + url.search);
  };

  // Wrap setFilters to reset pagination and update URL when filters change
  const handleFilterChange = (
    newFiltersOrUpdater: React.SetStateAction<typeof filters>
  ) => {
    const newFilters =
      typeof newFiltersOrUpdater === "function"
        ? newFiltersOrUpdater(filters)
        : newFiltersOrUpdater;

    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change

    // Update URL with new filters and reset page to 1
    updateUrl({
      page: 1,
      project: newFilters.project,
      district: newFilters.district,
      sex: newFilters.sex,
      isPWD: newFilters.isPWD,
    });
  };

  // Handle pagination changes with URL update
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl({
      page,
      per_page: pageSize,
    });
  };

  // Handle page size changes with URL update
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size

    updateUrl({
      page: 1,
      per_page: newPageSize,
    });
  };

  // Handle search changes with URL update
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page on new search

    updateUrl({
      page: 1,
      search,
    });
  };

  // Sync URL parameters with state
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const perPage = Number(searchParams.get("per_page")) || 10;
    const search = searchParams.get("search") || "";
    const project = searchParams.get("project") || "";
    const district = searchParams.get("district") || "";
    const sex = searchParams.get("sex") || "";
    const isPWD = searchParams.get("isPWD") || "";

    setCurrentPage(page);
    setPageSize(perPage);
    setSearchTerm(search);
    setFilters(prev => ({
      ...prev,
      project,
      district,
      sex,
      isPWD,
    }));
  }, [searchParams]);

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
    handlePageSizeChange,
    handleSearchChange,
    searchTerm,
    districts,
    sexOptions,
  };
}
