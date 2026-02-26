// ecommerce-ts/src/services/upload.service.ts
import {
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../config/s3.config";
import config from "../config/environment";

export const uploadToS3 = async (
  buffer: Buffer,
  key: string,
  contentType: string
) => {
  // Upload
  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  // Signed URL để xem ảnh
  const getCommand = new GetObjectCommand({
    Bucket: config.aws.s3Bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, getCommand, {
    expiresIn: 60 * 60, // 1 giờ
  });

  return { signedUrl };
};