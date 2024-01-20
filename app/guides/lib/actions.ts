'use server';

import { revalidatePath } from 'next/cache';
import { CreateGuideResponse } from './types';

export async function createGuide(
  prevState: CreateGuideResponse,
  formData: FormData,
): Promise<CreateGuideResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guides`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    console.log({ result });

    revalidatePath('/guides');

    return { guide: result, message: 'Guide created successfully' };
  } catch (error) {
    console.log('error is:', error);
    return { message: 'Failed to create guide', guide: null };
  }
}
