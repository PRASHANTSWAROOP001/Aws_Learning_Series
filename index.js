// Import required AWS SDK clients and commands for Node.js
const { S3Client, ListBucketsCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
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
 * Generates a pre-signed URL for downloading an object from S3.
 * @param {string} key - The key (filename) of the object in the S3 bucket.
 * @returns {Promise<string>} - A promise that resolves to the pre-signed URL.
 */
async function getObjectUrl(key) {
    const command = new GetObjectCommand({
        Bucket: "aws-s3-private-bucket-swaroop",
        Key: key
    });

    // Generate a pre-signed URL with a 20-second expiration
    const url = await getSignedUrl(s3Clinet, command, { expiresIn: 20 });

    return url;
}

/**
 * Initializes the process by generating a pre-signed URL for a specific file
 * and logging it to the console.
 * @returns {Promise<string>} - A promise that resolves to the generated URL.
 */
async function init() {
    const newUrl = await getObjectUrl("Swaroop.png");
    console.log("printing inside the code: ", newUrl);
    return newUrl;
}

// Start the initialization process
init();