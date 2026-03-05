// ecommerce-ts/src/services/upload.service.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import s3Client from "../config/s3.config";
import config from "../config/environment";

const urlImagePublic = `https://d1t1zve9xnspsc.cloudfront.net`;

export const uploadToS3 = async (
  buffer: Buffer,
  key: string,
  contentType: string
) => {

  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.aws.s3Bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const cloudfrontUrl = `${urlImagePublic}/${key}`;

  const signedUrl = getSignedUrl({
    url: cloudfrontUrl,
    keyPairId: config.aws.cloudfrontKeyPairId,
    privateKey: config.aws.cloudfrontPrivateKey,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  });

  return {
    url: cloudfrontUrl,
    signedUrl,
  };
};