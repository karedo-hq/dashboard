'use server';

type ActivateAccountResult = {
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string | null;
};

export async function activateAccountAction(code: string): Promise<ActivateAccountResult> {
  const res = await fetch(`${process.env.API_URL}/auth/activate-account`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (res.status === 404) {
    return { isError: true, errorMessage: 'Konto nicht gefunden', isSuccess: false };
  }

  if (res.status === 409) {
    return { isError: true, errorMessage: 'Konto bereits aktiviert', isSuccess: false };
  }

  return { isSuccess: true, isError: false, errorMessage: null };
}
