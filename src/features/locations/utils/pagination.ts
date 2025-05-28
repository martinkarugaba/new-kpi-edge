import type { PaginationParams, PaginationMetadata } from '../types';

/**
 * Validates and sanitizes pagination parameters
 */
export function validatePaginationParams(
  params: PaginationParams,
  defaultLimit: number = 10,
  maxLimit: number = 100
): Required<PaginationParams> {
  const { page = 1, limit = defaultLimit, search = '' } = params;

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

  const links: Record<'first' | 'prev' | 'next' | 'last', string | undefined> =
    {} as Record<'first' | 'prev' | 'next' | 'last', string | undefined>;

  // First page link
  if (page > 1) {
    links.first = `${baseUrl}?${new URLSearchParams({
      ...Object.fromEntries(queryParams),
      page: '1',
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
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
    search: searchParams.get('search') || undefined,
  };
}
