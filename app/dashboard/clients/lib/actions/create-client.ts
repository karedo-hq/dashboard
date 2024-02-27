'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth/lib/utils/auth';
import { LivingArrangements } from '../types/living-arrangements.type';
import { PrevGuardianType } from '../types/prev-guardian-type.types';
import { TypeOfGuardianship } from '../types/type-of-guardianship.type';
import { UserGender } from '../types/user-gender.type';
import { WealthStatus } from '../types/wealth-status.type';
import { APIResponse } from '@/lib/types/api-response.types';
import { Client } from '../types/client.type';

type SuccessResponse<T> = {
  isSuccess: true;
  isError: false;
  error: null;
  data: T;
};

type ErrorResponse = {
  isSuccess: false;
  isError: true;
  error: Error;
  data?: undefined;
};

export type CreateClientActionResult = SuccessResponse<Client> | ErrorResponse;

type CreateClientActionDto = {
  gender: UserGender;
  title?: string;
  firstname: string;
  lastname: string;
  birthday: Date;
  avatar?: string;
  localCourt?: string;
  caseNumber?: string;
  scopeOfDuties?: string[];
  guardianshipStartedAt: Date;
  guardianshipEndedAt?: Date;
  livingArrangement?: LivingArrangements;
  wealthStatus?: WealthStatus;
  typeOfGuardianship?: TypeOfGuardianship;
  isGuardianshipTakenOver: boolean;
  prevGuardianType?: PrevGuardianType;
  prevGuardianshipStartedAt?: Date;
};

export async function createClientAction(
  dto: CreateClientActionDto,
): Promise<CreateClientActionResult> {
  const session = await auth();

  if (!session) {
    return {
      isSuccess: false,
      isError: true,
      error: new Error('Not authenticated'),
    };
  }

  console.log({ dto });

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
    return {
      isSuccess: false,
      isError: true,
      error: new Error('Error creating client'),
    };
  }

  const resJSON: APIResponse<Client> = await res.json();

  revalidatePath('/dashboard/clients');

  return { isSuccess: true, isError: false, error: null, ...resJSON };
}
