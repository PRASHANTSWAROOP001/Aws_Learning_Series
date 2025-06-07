const {S3Client, ListBucketsCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");

dotenv.config()

const  accessKeyId = process.env.ACCESSKEYID;
const secretAccessKey = process.env.SECRET_KEY;

if(!accessKeyId || !secretAccessKey){
    console.log("key are not defined")
    process.exit(1)
}

const s3Clinet = new S3Client({
region:"ap-south-1",
credentials:{
accessKeyId:accessKeyId,
secretAccessKey:secretAccessKey
},

})


async function getObjectUrl(key) {

    const command = new GetObjectCommand({
        Bucket:"aws-s3-private-bucket-swaroop",
        Key:key
    })

    const url = await getSignedUrl(s3Clinet, command,{expiresIn:20})

    return url;
    
}

async function init() {
    const newUrl = await getObjectUrl("Swaroop.png");
    console.log("printing inside the code: ", newUrl);
    return newUrl;
}

init()