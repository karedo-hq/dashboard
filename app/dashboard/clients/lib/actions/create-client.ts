'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth/lib/utils/auth';
import { APIResponse, ErrorResponse, SuccessResponse } from '@/lib/types/api-responses.types';
import { Client } from '../types/client.type';

export type CreateClientResult = SuccessResponse<Client> | ErrorResponse;

export type CreateClientDto = Pick<
  Client,
  | 'gender'
  | 'title'
  | 'firstname'
  | 'lastname'
  | 'birthday'
  | 'avatar'
  | 'localCourt'
  | 'caseNumber'
  | 'scopeOfDuties'
  | 'guardianshipStartedAt'
  | 'guardianshipEndedAt'
  | 'livingArrangements'
  | 'wealthStatus'
  | 'typeOfGuardianship'
  | 'isGuardianshipTakenOver'
  | 'prevGuardianType'
  | 'prevGuardianshipStartedAt'
>;

export async function createClient(dto: CreateClientDto): Promise<CreateClientResult> {
  const session = await auth();

  if (!session) {
    return {
      isSuccess: false,
      isError: true,
      errorMessage: 'Not authenticated',
    };
  }

  const guardianId = session.user._id;
  const url = `${process.env.API_URL}/clients`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
    body: JSON.stringify({ ...dto, guardianId }),
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

  return { isSuccess: true, isError: false, errorMessage: null, ...resJSON };
}
