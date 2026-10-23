import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME || 'portfolio-rasshqa';
const endpoint = process.env.AWS_ENDPOINT || process.env.S3_ENDPOINT;

export const isS3Configured = Boolean(accessKeyId && secretAccessKey);

export function getS3Client(): S3Client | null {
  if (!isS3Configured) {
    return null;
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId: accessKeyId!,
      secretAccessKey: secretAccessKey!,
    },
    ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
  });
}

/**
 * Upload a buffer or stream to S3 / S3-compatible storage (Neon Object Storage, AWS S3, Cloudflare R2)
 */
export async function uploadToS3(params: {
  key: string;
  buffer: Buffer;
  contentType: string;
}): Promise<string> {
  const client = getS3Client();
  if (!client) {
    throw new Error('AWS S3 credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) are not configured.');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: params.key,
    Body: params.buffer,
    ContentType: params.contentType,
  });

  await client.send(command);

  // Return public URL or presigned URL
  if (process.env.AWS_PUBLIC_URL_PREFIX) {
    return `${process.env.AWS_PUBLIC_URL_PREFIX.replace(/\/$/, '')}/${params.key}`;
  }

  if (endpoint) {
    return `${endpoint.replace(/\/$/, '')}/${bucketName}/${params.key}`;
  }

  return `https://${bucketName}.s3.${region}.amazonaws.com/${params.key}`;
}

/**
 * Generate a pre-signed URL for direct browser-to-S3 uploads
 */
export async function generatePresignedUploadUrl(params: {
  key: string;
  contentType: string;
  expiresIn?: number;
}): Promise<{ uploadUrl: string; fileUrl: string }> {
  const client = getS3Client();
  if (!client) {
    throw new Error('AWS S3 credentials are not configured.');
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: params.key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: params.expiresIn || 300,
  });

  const fileUrl = process.env.AWS_PUBLIC_URL_PREFIX 
    ? `${process.env.AWS_PUBLIC_URL_PREFIX.replace(/\/$/, '')}/${params.key}`
    : `https://${bucketName}.s3.${region}.amazonaws.com/${params.key}`;

  return { uploadUrl, fileUrl };
}
