'use server';

import { RegisterDto } from '@/auth/lib/types/register.types';
import { User } from '@/auth/lib/types/user.types';
import { APIResponse } from '@/lib/types/api-response.types';

export async function registerAction(dto: RegisterDto): Promise<APIResponse<User>> {
  const res = await fetch(`${process.env.API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw new Error('Registrierung fehlgeschlagen');
  }

  const createdUser: Promise<APIResponse<User>> = await res.json();

  return createdUser;
}
