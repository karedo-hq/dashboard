import { APIResponse } from './api-responses.types';

export type PaginationOptions<T = string> = {
  page?: number;
  limit?: number;
  sortBy?: T;
  sortOrder?: 'asc' | 'desc';
  searchQuery?: string;
};

export type PaginatedResponse<T> = APIResponse<
  T[],
  {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  }
>;
