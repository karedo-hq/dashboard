'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth/lib/utils/auth';
import { APIResponse, ErrorResponse, SuccessResponse } from '@/lib/types/api-responses.types';
import { Client } from '../types/client.type';
import { CreateClientActionDto } from './create-client';
import { ClientMaritalStatus } from '../types/client-marital-status.type';

export type UpdateClientActionResult = SuccessResponse<Client> | ErrorResponse;

type UpdateClientActionDto = Partial<CreateClientActionDto> & {
  deathday?: Date;
  maritalStatus?: ClientMaritalStatus;
  numberOfChildren?: number;
  isSingleParent?: boolean;
};

export async function updateClientAction(
  _id: string,
  dto: UpdateClientActionDto,
): Promise<UpdateClientActionResult> {
  const session = await auth();

  if (!session) {
    return {
      isSuccess: false,
      isError: true,
      errorMessage: 'Not authenticated',
    };
  }

  const url = `${process.env.API_URL}/clients/${_id}`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
    body: JSON.stringify(dto),
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

  const resJSON: APIResponse<Client> = await res.json();

  revalidatePath('/dashboard/clients');
  revalidatePath(`/dashboard/clients/${_id}`);

  return { isSuccess: true, isError: false, errorMessage: null, ...resJSON };
}
