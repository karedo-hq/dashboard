'use server';

import { APIResponse, ErrorResponse, SuccessResponse } from '@/lib/types/api-responses.types';
import { Client } from '../types/client.type';
import { auth } from '@/auth/lib/utils/auth';

type FindClientActionResult = SuccessResponse<Client> | ErrorResponse;

export async function findClientAction(_id: string): Promise<FindClientActionResult> {
  const session = await auth();

  if (!session) {
    return {
      isSuccess: false,
      isError: true,
      error: new Error('Not authenticated'),
    };
  }

  const url = `${process.env.API_URL}/clients/${_id}`;

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
      error: new Error('Error fetching client details'),
    };
  }

  const resJSON: APIResponse<Client> = await res.json();

  return { isSuccess: true, isError: false, error: null, ...resJSON };
}
