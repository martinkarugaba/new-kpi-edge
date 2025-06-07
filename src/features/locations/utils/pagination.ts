import type { PaginationParams, PaginationMetadata } from "../types";

/**
 * Validates and sanitizes pagination parameters
 */
export function validatePaginationParams(
  params: PaginationParams,
  defaultLimit: number = 10,
  maxLimit: number = 100
): Required<PaginationParams> {
  const { page = 1, limit = defaultLimit, search = "" } = params;

  return {
    page: Math.max(1, page),
    limit: Math.min(Math.max(1, limit), maxLimit),
    search: search.trim(),
  };
}

/**
 * Creates pagination metadata
 */
export function createPaginationMetadata(
  page: number,
  limit: number,
  total: number
): PaginationMetadata {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Calculates offset for database queries
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Creates pagination links for API responses
 */
export function createPaginationLinks(
  baseUrl: string,
  page: number,
  limit: number,
  total: number,
  additionalParams?: Record<string, string>
): {
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
} {
  const totalPages = Math.ceil(total / limit);
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    ...additionalParams,
  });

  const links: Record<"first" | "prev" | "next" | "last", string | undefined> =
    {} as Record<"first" | "prev" | "next" | "last", string | undefined>;

  // First page link
  if (page > 1) {
    links.first = `${baseUrl}?${new URLSearchParams({
      ...Object.fromEntries(queryParams),
      page: "1",
    }).toString()}`;
  }

  // Previous page link
  if (page > 1) {
    links.prev = `${baseUrl}?${new URLSearchParams({
      ...Object.fromEntries(queryParams),
      page: (page - 1).toString(),
    }).toString()}`;
  }

  // Next page link
  if (page < totalPages) {
    links.next = `${baseUrl}?${new URLSearchParams({
      ...Object.fromEntries(queryParams),
      page: (page + 1).toString(),
    }).toString()}`;
  }

  // Last page link
  if (page < totalPages) {
    links.last = `${baseUrl}?${new URLSearchParams({
      ...Object.fromEntries(queryParams),
      page: totalPages.toString(),
    }).toString()}`;
  }

  return links;
}

/**
 * Parses pagination parameters from URL search params
 */
export function parsePaginationFromSearchParams(
  searchParams: URLSearchParams
): PaginationParams {
  return {
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: parseInt(searchParams.get("limit") || "10", 10),
    search: searchParams.get("search") || undefined,
  };
}

/**
 * Forward declaration for function defined below
 */

/**
 * Generates pagination parameters for cumulative data loading when page size increases
 * This is used to fetch all data up to the new limit when increasing rows per page
 */
export function getCumulativePaginationParams(
  currentPage: number,
  newLimit: number,
  oldLimit: number,
  reset: boolean = false
): Required<PaginationParams> {
  // If requesting less data than before or explicitly resetting, just use standard pagination
  if (newLimit <= oldLimit || reset) {
    return {
      page: currentPage,
      limit: newLimit,
      search: "",
    };
  }

  // When requesting more data than before (increasing rows per page),
  // we always fetch from page 1 with the new limit to get all data
  return {
    page: 1,
    limit: newLimit,
    search: "",
  };
}

/**
 * Merges accumulated data with new data, ensuring no duplicates by ID
 * Used when increasing page size to accumulate data properly
 */
export function mergeWithoutDuplicates<T extends { id: string }>(
  existingData: T[],
  newData: T[]
): T[] {
  // Handle null or undefined cases safely
  if (!existingData || !Array.isArray(existingData))
    return Array.isArray(newData) ? newData : [];
  if (!newData || !Array.isArray(newData)) return existingData;

  const uniqueData = [...existingData];
  const existingIds = new Set(
    existingData
      .filter(item => item && typeof item === "object" && "id" in item)
      .map(item => item.id)
  );

  for (const item of newData) {
    if (
      item &&
      typeof item === "object" &&
      "id" in item &&
      !existingIds.has(item.id)
    ) {
      uniqueData.push(item);
    }
  }

  return uniqueData;
}

/**
 * Determines if data should be accumulated based on pagination changes
 *
 * @param newPageSize - The new page size being set
 * @param threshold - Threshold above which accumulation should happen (default: base page size)
 * @param currentPage - Current page number
 * @param lastPageSize - Previous page size for comparison
 * @param accumulateOnPageChange - Whether to accumulate data on page changes (default: true)
 */
export function shouldAccumulateData(
  newPageSize: number,
  threshold: number = 10,
  currentPage: number = 1,
  lastPageSize?: number,
  accumulateOnPageChange: boolean = true
): boolean {
  // For page size changes
  if (lastPageSize) {
    return newPageSize > lastPageSize; // Accumulate when increasing page size regardless of page
  }

  // For threshold-based accumulation (usually on first load)
  const shouldAccumulateBasedOnSize = newPageSize > threshold;

  // For page navigation - if on page > 1 and we want to accumulate on page changes
  const shouldAccumulateBasedOnPage = accumulateOnPageChange && currentPage > 1;

  return shouldAccumulateBasedOnSize || shouldAccumulateBasedOnPage;
}

/**
 * Generates query parameters for fetching data when pagination changes
 * This handles both page navigation and page size changes
 *
 * @param currentPage - Current page number
 * @param newPage - New page number requested
 * @param currentPageSize - Current page size
 * @param newPageSize - New page size requested
 * @param search - Current search term
 * @returns Pagination parameters to use for the query
 */
export function getQueryPaginationParams(
  currentPage: number,
  newPage: number,
  currentPageSize: number,
  newPageSize: number,
  search: string = ""
): Required<PaginationParams> {
  const isPageSizeChange = newPageSize !== currentPageSize;
  const isPageSizeIncrease = newPageSize > currentPageSize;

  // Case 1: Increasing page size - fetch from first page with new page size
  if (isPageSizeChange && isPageSizeIncrease) {
    return {
      page: 1,
      limit: newPageSize,
      search,
    };
  }

  // Case 2: Decreasing page size - reset to the new page with new page size
  if (isPageSizeChange && !isPageSizeIncrease) {
    return {
      page: newPage,
      limit: newPageSize,
      search,
    };
  }

  // Case 3: Page navigation - fetch data for the new page
  return {
    page: newPage,
    limit: newPageSize,
    search,
  };
}
