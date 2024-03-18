'use server';

import { auth } from '@/auth/lib/utils/auth';

type LogoutResult = {
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | null;
};

export async function logoutAction(): Promise<LogoutResult> {
  const session = await auth();

  if (!session) {
    return { isError: true, errorMessage: 'Keine Sitzung gefunden', isSuccess: false };
  }

  const res = await fetch(`${process.env.API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.tokens.accessToken}`,
    },
  });

  if (!res.ok) {
    return { isError: true, errorMessage: 'Abmeldung fehlgeschlagen', isSuccess: false };
  }

  return { isSuccess: true, isError: false, errorMessage: null };
}
