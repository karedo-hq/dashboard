'use server';

import { auth } from '@/auth/lib/utils/auth';
import { Client } from '../types/client.type';
import { PaginationOptions, PaginatedResponse } from '@/lib/types/pagination.types';
import { preparePaginationParams } from '@/lib/utils/prepare-pagination-params';
import { ErrorResponse, SuccessResponse } from '@/lib/types/api-responses.types';

type FindAllClientsActionResult =
  | (PaginatedResponse<Client> & Omit<SuccessResponse, 'data'>)
  | Omit<ErrorResponse, 'data'>;

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
      errorMessage: 'Not authenticated',
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
    const resJSON = await res.json();
    const errorMessage = resJSON.message;
    return {
      isSuccess: false,
      isError: true,
      errorMessage,
    };
  }

  const resJSON: PaginatedResponse<Client> = await res.json();

  return { isSuccess: true, isError: false, errorMessage: null, ...resJSON };
}
