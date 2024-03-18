'use server';

import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getErrorMessage } from '../utils/get-error-message';
import { ErrorResponse, SuccessResponse } from '../types/api-responses.types';

type DeleteFileResult = SuccessResponse<null> | ErrorResponse;

export async function deleteFileAction(objectKey: string): Promise<DeleteFileResult> {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const input = {
    Bucket: process.env.AWS_BUCKET_NAME as string,
    Key: objectKey,
  };
  const command = new DeleteObjectCommand(input);

  try {
    await client.send(command);
  } catch (error) {
    return {
      isSuccess: false,
      isError: true,
      errorMessage: getErrorMessage(error),
    };
  }

  return {
    data: null,
    isSuccess: true,
    isError: false,
    errorMessage: null,
  };
}
