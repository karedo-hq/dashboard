'use server';

import { revalidatePath } from 'next/cache';
import { Guide } from './types';
import { getErrorMessage } from '@/lib/utils/get-error-message';

export async function createGuide(
  videoKey: string,
): Promise<{ data?: Guide; errorMessage?: string }> {
  try {
    const response = await fetch(`${process.env.API_URL}/guides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoKey }),
    });

    const data: Guide = await response.json();

    revalidatePath('/guides');

    return { data };
  } catch (error) {
    return { errorMessage: getErrorMessage(error) };
  }
}
