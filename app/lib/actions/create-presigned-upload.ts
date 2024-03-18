'use server';

import { PresignedPost, createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getErrorMessage } from '../utils/get-error-message';
import { ErrorResponse, SuccessResponse } from '../types/api-responses.types';

type CreatePresignedUploadResult = SuccessResponse<PresignedPost> | ErrorResponse;

export async function createPresignedUploadAction({
  contentType,
  folder,
}: {
  contentType: string;
  folder?: string;
}): Promise<CreatePresignedUploadResult> {
  let key = uuidv4();

  if (folder) {
    key = `${folder}/${key}`;
  }

  try {
    const client = new S3Client({ region: process.env.AWS_REGION });
    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 10485760], // up to 10 MB
        ['starts-with', '$Content-Type', contentType],
      ],
      Fields: {
        acl: 'public-read',
        'Content-Type': contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });

    return {
      isSuccess: true,
      data: {
        url,
        fields,
      },
      isError: false,
      errorMessage: null,
    };
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      errorMessage: getErrorMessage(error),
    };
  }
}
