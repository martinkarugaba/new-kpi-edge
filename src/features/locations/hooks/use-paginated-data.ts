"use client";

import { useState, useCallback, useEffect } from "react";
import { mergeWithoutDuplicates } from "../utils/pagination";

interface PaginatedData<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface PaginatedResponse<T> {
  success: boolean;
  data: PaginatedData<T>;
}

interface UsePaginatedDataOptions {
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: string;
  accumulateOnSizeIncrease?: boolean;
  accumulateOnNextPage?: boolean;
}

/**
 * A reusable hook for handling paginated data with accumulation
 */
export function usePaginatedData<T extends { id: string }>(
  queryFn: (params: {
    page: number;
    limit: number;
    search: string;
  }) => Promise<PaginatedResponse<T> | undefined>,
  initialData: T[],
  options: UsePaginatedDataOptions = {}
) {
  const {
    initialPage = 1,
    initialPageSize = 20,
    initialSearch = "",
    accumulateOnSizeIncrease = true,
    accumulateOnNextPage = true,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(initialSearch);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<PaginatedResponse<T> | undefined>(
    initialData.length > 0
      ? {
          success: true,
          data: {
            data: initialData,
            pagination: {
              page: initialPage,
              limit: initialPageSize,
              total: initialData.length,
              totalPages: Math.ceil(initialData.length / initialPageSize),
              hasNext: false,
              hasPrev: false,
            },
          },
        }
      : undefined
  );
  const [accumulatedData, setAccumulatedData] = useState<T[]>(initialData);

  // Function to fetch data with the current pagination parameters
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await queryFn({
        page,
        limit: pageSize,
        search,
      });

      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search, queryFn]);

  // Effect to fetch data when pagination or search changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effect to handle data accumulation
  useEffect(() => {
    if (response?.success) {
      const newData = response.data.data;
      const isPageSizeAccumulation =
        accumulateOnSizeIncrease && pageSize > initialPageSize;
      const isNextPageAccumulation = accumulateOnNextPage && page > 1;

      setAccumulatedData(prevData => {
        if (isPageSizeAccumulation || isNextPageAccumulation) {
          // Merge while preventing duplicates
          return mergeWithoutDuplicates(prevData, newData);
        } else {
          // For first page or search changes, use the new data directly
          return newData;
        }
      });
    }
  }, [
    response,
    page,
    pageSize,
    accumulateOnSizeIncrease,
    accumulateOnNextPage,
    initialPageSize,
  ]);

  // Handler for pagination changes
  const handlePaginationChange = useCallback(
    (newPage: number, newPageSize: number) => {
      const isPageSizeChange = newPageSize !== pageSize;
      const isPageSizeIncrease = newPageSize > pageSize;
      const isPageChange = newPage !== page;
      const isNextPage = newPage > page;

      if (isPageSizeChange) {
        if (isPageSizeIncrease && accumulateOnSizeIncrease) {
          // When increasing page size, keep accumulated data and fetch more
          setPage(1); // Reset to first page to fetch all data up to new limit
        } else {
          // When decreasing page size, reset accumulation
          setAccumulatedData([]);
          setPage(newPage);
        }
        setPageSize(newPageSize);
      } else if (isPageChange) {
        if (isNextPage && accumulateOnNextPage) {
          // Moving to next page - keep accumulated data and add new data
          setPage(newPage);
        } else {
          // Moving to previous page or jumping to a specific page - reset accumulation
          setAccumulatedData([]);
          setPage(newPage);
        }
      } else {
        // No change in page or page size, do nothing
        setPage(newPage);
      }
    },
    [page, pageSize, accumulateOnSizeIncrease, accumulateOnNextPage]
  );

  // Return everything needed for the component
  return {
    page,
    pageSize,
    search,
    isLoading,
    error,
    response,
    accumulatedData,
    setPage,
    setPageSize,
    setSearch,
    handlePaginationChange,
    // Return the final data to be used by the table
    data:
      accumulatedData.length > 0
        ? accumulatedData
        : response?.success
          ? response.data.data
          : initialData,
    paginationData: response?.success
      ? response.data.pagination
      : {
          page,
          limit: pageSize,
          total: initialData.length,
          totalPages: Math.ceil(initialData.length / pageSize),
          hasNext: false,
          hasPrev: false,
        },
  };
}
