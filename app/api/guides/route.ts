import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const res = await fetch(`${process.env.API_URL}/guides`, {
      method: 'POST',
      body: formData,
    });

    console.log('process.env.API_URL: ', process.env.API_URL);
    console.log('res: ', res);

    const data = await res.json();

    revalidatePath('/guides');

    return Response.json(data);
  } catch (error) {
    throw error;
  }
}
