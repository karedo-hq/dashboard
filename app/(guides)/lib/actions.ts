'use server';

import { revalidatePath } from 'next/cache';
import { Guide } from './types';

export async function createGuide(formData: FormData): Promise<Guide> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guides`, {
      method: 'POST',
      body: formData,
    });

    const guide = await response.json();

    console.log('guide: ', guide);

    revalidatePath('/guides');

    return guide;
  } catch (error) {
    throw error;
  }
}
