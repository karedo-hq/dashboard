'use server';

import { auth } from '@/auth/lib/utils/auth';

type LogoutResult = {
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
};

export async function logoutAction(): Promise<LogoutResult> {
  const session = await auth();

  if (!session) {
    return { isError: true, error: new Error('No session found'), isSuccess: false };
  }

  const res = await fetch(`${process.env.API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
  });

  if (!res.ok) {
    return { isError: true, error: new Error('Failed to logout'), isSuccess: false };
  }

  console.log(res);

  return { isSuccess: true, isError: false, error: null };
}
