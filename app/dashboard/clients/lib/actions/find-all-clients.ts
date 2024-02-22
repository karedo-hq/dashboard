'use server';

import { auth } from '@/auth/lib/utils/auth';
import { Client } from '../types/client.type';

type FindAllClientsActionResult = {
  data: Client[] | null;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
};

type FindAllClientsDto = {
  page?: number;
  limit?: number;
  searchQuery?: string;
  sortBy?:
    | 'firstname'
    | 'lastname'
    | 'birthday'
    | 'isGuardianshipTakenOver'
    | 'startDateOfGuardianship'
    | 'creationDate';
  sortOrder?: 'asc' | 'desc';
};

export async function findAllClientsAction(
  dto?: FindAllClientsDto,
): Promise<FindAllClientsActionResult> {
  const session = await auth();

  if (!session) {
    return {
      isSuccess: false,
      isError: true,
      error: new Error('Not authenticated'),
      data: null,
    };
  }

  const { page = 1, limit = 10, searchQuery, sortBy, sortOrder } = dto || {};

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(searchQuery && { searchQuery }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  }).toString();

  const url = `${process.env.API_URL}/clients?${params}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
  });

  if (!res.ok) {
    return {
      isSuccess: false,
      isError: true,
      error: new Error('Error fetching clients'),
      data: null,
    };
  }

  const clients: Client[] = await res.json();

  return { isSuccess: true, isError: false, error: null, data: clients };
}
