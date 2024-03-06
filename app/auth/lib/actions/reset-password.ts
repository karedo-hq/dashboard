'use server';

import { ErrorResponse, SuccessResponse } from '@/lib/types/api-responses.types';
import jwt from 'jsonwebtoken';

type ResetPasswordResult = Omit<SuccessResponse, 'data'> | ErrorResponse;

export async function resetPasswordAction(
  userId: string,
  newPassword: string,
): Promise<ResetPasswordResult> {
  const code = jwt.sign({ _id: userId, newPassword }, process.env.JWT_RESET_PASSWORD_SECRET!, {
    expiresIn: '1h',
  });

  const res = await fetch(`${process.env.API_URL}/auth/reset-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!res.ok) {
    const resJSON = await res.json();
    const errorMessage = resJSON.message;
    return { isError: true, errorMessage, isSuccess: false };
  }

  return { isSuccess: true, isError: false, errorMessage: null };
}
