const {S3Client, DeleteObjectCommand, PutObjectCommand, ListObjectsV2Command} = require("@aws-sdk/client-s3");
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


async function getUploadUrl(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket:"aws-s3-private-bucket-swaroop",
        Key:`uploads/user-upload/${filename}`,
        ContentType:contentType
    })

    const url = await getSignedUrl(s3Clinet, command)
    
    console.log(url);

    return url;   

}

async function listObjects() {

    const command = new ListObjectsV2Command({
        Bucket:"aws-s3-private-bucket-swaroop",
        Key:"/"
    })

    const objects = await s3Clinet.send(command);

    console.log(objects);

    return objects;
    
}

async function deleteFiles(filename) {

    const command = new DeleteObjectCommand({
        Bucket:"aws-s3-private-bucket-swaroop",
        Key:`/uploads/user-upload/${filename}`
    })

    const deletedRes = await s3Clinet.send(command);
    console.log(deletedRes);

    return deletedRes;
    
}



(async ()=>{
    // const newUrl = await getUploadUrl("new.png","image/png");
  
    // console.log(newUrl); 

     await deleteFiles('new.png')

     await listObjects();
    
    
})();



