'use server';

import { ErrorResponse, SuccessResponse } from '@/lib/types/api-responses.types';

type RequestResetPasswordResult = Omit<SuccessResponse, 'data'> | ErrorResponse;

export async function requestResetPasswordAction(
  email: string,
): Promise<RequestResetPasswordResult> {
  const res = await fetch(`${process.env.API_URL}/auth/request-reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const resJSON = await res.json();
    const errorMessage = resJSON.message;
    return { isError: true, errorMessage, isSuccess: false };
  }

  return { isSuccess: true, isError: false, errorMessage: null };
}
