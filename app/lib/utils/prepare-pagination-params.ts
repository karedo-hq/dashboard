import { PaginationOptions } from '../types/pagination.types';

export function preparePaginationParams(params: PaginationOptions): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, value.toString());
    }
  });

  return searchParams;
}
