// Import required AWS SDK clients and commands for Node.js
const { S3Client, DeleteObjectCommand, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Retrieve AWS credentials from environment variables
const accessKeyId = process.env.ACCESSKEYID;
const secretAccessKey = process.env.SECRET_KEY;

// Exit if credentials are not defined
if (!accessKeyId || !secretAccessKey) {
    console.log("key are not defined");
    process.exit(1);
}

// Initialize the S3 client with region and credentials
const s3Clinet = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    },
});

/**
 * Generates a pre-signed URL for uploading a file to S3.
 * @param {string} filename - The name of the file to upload.
 * @param {string} contentType - The MIME type of the file.
 * @returns {Promise<string>} - A promise that resolves to the pre-signed URL.
 */
async function getUploadUrl(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket: "aws-s3-private-bucket-swaroop",
        Key: `uploads/user-upload/${filename}`,
        ContentType: contentType
    });

    const url = await getSignedUrl(s3Clinet, command);

    console.log(url); // Log the generated URL

    return url;
}

/**
 * Lists all objects in the specified S3 bucket.
 * @returns {Promise<Object>} - A promise that resolves to the list of objects.
 */
async function listObjects() {
    const command = new ListObjectsV2Command({
        Bucket: "aws-s3-private-bucket-swaroop",
        Key: "/"
    });

    const objects = await s3Clinet.send(command);

    console.log(objects); // Log the list of objects

    return objects;
}

/**
 * Deletes a file from the S3 bucket.
 * @param {string} filename - The name of the file to delete.
 * @returns {Promise<Object>} - A promise that resolves to the delete response.
 */
async function deleteFiles(filename) {
    const command = new DeleteObjectCommand({
        Bucket: "aws-s3-private-bucket-swaroop",
        Key: `/uploads/user-upload/${filename}`
    });

    const deletedRes = await s3Clinet.send(command);
    console.log(deletedRes); // Log the delete response

    return deletedRes;
}

// Example usage: Uncomment to generate upload URL, delete a file, or list objects
(async () => {
    // Generate a pre-signed upload URL for 'new.png'
    // const newUrl = await getUploadUrl("new.png", "image/png");
    // console.log(newUrl);

    // Delete 'new.png' from the bucket
    await deleteFiles('new.png');

    // List all objects in the bucket
    await listObjects();
})();



