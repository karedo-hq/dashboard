'use server';

import jwt from 'jsonwebtoken';

type ResetPasswordResult = {
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
};

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
    return { isError: true, error: new Error(errorMessage), isSuccess: false };
  }

  return { isSuccess: true, isError: false, error: null };
}
