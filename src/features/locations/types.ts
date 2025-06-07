export interface Location {
  id: string;
  name: string;
  code: string;
  country: string;
  district: string;
  sub_county: string;
  parish: string;
  village: string;
  created_at: Date;
  updated_at: Date | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
