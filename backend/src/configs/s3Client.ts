import { S3Client } from "@aws-sdk/client-s3";

const region = process.env["S3_REGION"];
const endpoint = process.env["S3_ENDPOINT"];

if (!region || !endpoint) {
  throw new Error("S3_REGION or S3_ENDPOINT not defined in .env");
}

const s3 = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId: process.env["S3_ACCESS_KEY"]!,
    secretAccessKey: process.env["S3_SECRET_KEY"]!,
  },
  forcePathStyle: true,
});

export default s3;
