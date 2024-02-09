'use server';

import { RegisterDto } from '@/auth/lib/types/register.types';
import { AuthTokens } from '../types/tokens.types';

export async function register(dto: RegisterDto) {
  const res = await fetch(`${process.env.API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    throw new Error('Failed to register');
  }

  const tokens: Promise<AuthTokens> = await res.json();

  return tokens;
}
