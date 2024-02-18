'use server';

import { RegisterDto } from '@/auth/lib/types/register.types';
import { User } from '@/auth/lib/types/user.types';

export async function registerAction(dto: RegisterDto): Promise<User> {
  const res = await fetch(`${process.env.API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw new Error('Registrierung fehlgeschlagen');
  }

  const createdUser: Promise<User> = await res.json();

  return createdUser;
}
