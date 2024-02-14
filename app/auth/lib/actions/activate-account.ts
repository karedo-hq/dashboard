'use server';

type ActivateAccountResult = {
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
};

export async function activateAccount(code: string): Promise<ActivateAccountResult> {
  const res = await fetch(`${process.env.API_URL}/auth/activate-account`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (res.status === 404) {
    return { isError: true, error: new Error('User not found'), isSuccess: false };
  }

  if (res.status === 409) {
    return { isError: true, error: new Error('Account already activated'), isSuccess: false };
  }

  return { isSuccess: true, isError: false, error: null };
}
