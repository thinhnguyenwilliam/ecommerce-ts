// ecommerce-ts/src/services/upload.service.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../config/s3.config";
import config from "../config/environment";

export const uploadToS3 = async (
  buffer: Buffer,
  key: string,
  contentType: string
) => {
  const command = new PutObjectCommand({
    Bucket: config.aws.s3Bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `https://${config.aws.s3Bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;
};