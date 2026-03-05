import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import config from "../config/environment";

const s3 = new S3Client({ region: config.aws.region});

const DEST_BUCKET = config.aws.s3Bucket;

const RESIZE_CONFIGS = [
    { width: 150, suffix: "thumbnail" },
];

const SUPPORTED_FORMATS: Record<string, boolean> = {
    jpg: true,
    jpeg: true,
    png: true,
    webp: true,
};

export const handler = async (event: any, context: any) => {
    console.log("Lambda start");
    console.log("Memory:", context.memoryLimitInMB);
    console.log("Event:", JSON.stringify(event));

    const results = [];

    for (const record of event.Records) {
        const result = await processImage(record);
        results.push(result);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Successfully processed ${results.length} image(s)`,
            results,
        }),
    };
};

const processImage = async (record: any) => {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    const ext = key.split(".").pop()?.toLowerCase();
    if (!ext || !SUPPORTED_FORMATS[ext]) {
        return { key, skipped: true };
    }

    const originalImage = await s3.send(
        new GetObjectCommand({ Bucket: bucket, Key: key })
    );

    const buffer = await streamToBuffer(originalImage.Body);

    const resizedResults = [];

    for (const config of RESIZE_CONFIGS) {
        const resized = await sharp(buffer)
            .resize(config.width)
            .toBuffer();

        const newKey = key.replace(
            `.${ext}`,
            `_${config.suffix}.${ext}`
        );

        await s3.send(
            new PutObjectCommand({
                Bucket: DEST_BUCKET,
                Key: newKey,
                Body: resized,
                ContentType: `image/${ext}`,
            })
        );

        resizedResults.push(newKey);
    }

    return { key, resized: resizedResults };
};

const streamToBuffer = async (stream: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk: Buffer) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
    });
};