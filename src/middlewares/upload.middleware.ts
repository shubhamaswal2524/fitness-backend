import multer from "multer";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// AWS S3 client configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION!, // Your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // Your AWS Access Key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, // Your AWS Secret Key
  },
});

// In-memory storage for Multer (uploads are stored in memory first)
const storage = multer.memoryStorage();

// Multer setup with in-memory storage
export const upload = multer({
  storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
  },
}).fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "physiquePicture", maxCount: 1 },
  { name: "notificationFile", maxCount: 1 },
]);

// Function to upload file to S3
/**
 * Uploads a file to S3 and returns the public URL.
 * @param file - The multer file object
 * @param folder - Folder name (used as a prefix in the S3 key)
 * @returns Public URL of the uploaded file
 */
export const uploadFileToS3 = async (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  try {
    const ext = path.extname(file.originalname);
    const filename = `${folder}/${uuidv4()}${ext}`;

    // S3 Upload Command
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!, // Your S3 bucket name
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    });

    // Upload the file to S3
    await s3.send(command);

    // Return the public URL of the uploaded file
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};
