import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guides`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    revalidatePath('/guides');

    return Response.json(data);
  } catch (error) {
    throw error;
  }
}
