'use server';

import { revalidatePath } from 'next/cache';
import { Guide } from './types';

export async function createGuide(formData: FormData): Promise<Guide> {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    title: 'How to Log Into CoinGecko with Google Account',
    steps: [
      {
        title: 'Step 1: Navigate to CoinGecko Website',
        description:
          "Open your web browser and enter 'coingecko.com' in the address bar to visit the official CoinGecko website.",
        videoUrl:
          'https://airdocs-bucket.s3.eu-central-1.amazonaws.com/video-segments/4a39fcb4-6b91-497c-91b4-60836e93cf60.mp4',
      },
      {
        title: 'Step 2: Access the Login Page',
        description:
          "On the CoinGecko homepage, locate and click on the 'Log in' button found in the top navigation bar.",
        videoUrl:
          'https://airdocs-bucket.s3.eu-central-1.amazonaws.com/video-segments/f0b708e2-77fd-4087-9b8e-98219adf71c1.mp4',
      },
      {
        title: 'Step 3: Log in with Google Account',
        description:
          'Choose to log in using your Google account by clicking on the Google login option. When prompted, select your Google account or enter your Google credentials if not already logged into Google on your browser.',
        videoUrl:
          'https://airdocs-bucket.s3.eu-central-1.amazonaws.com/video-segments/11801c9b-3995-480a-bf0a-8841d9c67918.mp4',
      },
      {
        title: 'Step 4: Verify Your Account Details',
        description:
          'After logging in, verify that you are logged into the correct account by clicking on your profile icon or account name to view your account details and ensure all is in order.',
        videoUrl:
          'https://airdocs-bucket.s3.eu-central-1.amazonaws.com/video-segments/4aa35379-532a-4f71-8e75-740cad87cad3.mp4',
      },
    ],
  };

  // try {
  //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/guides`, {
  //     method: 'POST',
  //     body: formData,
  //   });

  //   const guide = await response.json();

  //   console.log('guide: ', guide);

  //   revalidatePath('/guides');

  //   return guide;
  // } catch (error) {
  //   throw error;
  // }
}
