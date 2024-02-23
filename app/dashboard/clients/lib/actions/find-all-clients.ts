'use server';

import { auth } from '@/auth/lib/utils/auth';
import { Client } from '../types/client.type';
import { PaginationOptions, PaginatedResponse } from '@/lib/types/pagination.types';
import { preparePaginationParams } from '@/lib/utils/prepare-pagination-params';

type FindAllClientsActionResult = Partial<PaginatedResponse<Client>> & {
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
};

type FindAllClientsDto = PaginationOptions<
  | 'firstname'
  | 'lastname'
  | 'birthday'
  | 'isGuardianshipTakenOver'
  | 'startDateOfGuardianship'
  | 'creationDate'
>;

export async function findAllClientsAction(
  dto?: FindAllClientsDto,
): Promise<FindAllClientsActionResult> {
  const session = await auth();

  if (!session) {
    return {
      isSuccess: false,
      isError: true,
      error: new Error('Not authenticated'),
    };
  }

  const params = preparePaginationParams(dto || {});

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
    };
  }

  const resJSON: PaginatedResponse<Client> = await res.json();

  return { isSuccess: true, isError: false, error: null, ...resJSON };
}
