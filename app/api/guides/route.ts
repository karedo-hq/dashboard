import { revalidatePath } from 'next/cache';
export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const res = await fetch(`${process.env.API_URL}/guides`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    revalidatePath('/guides');

    return Response.json(data);
  } catch (error) {
    throw error;
  }
}
