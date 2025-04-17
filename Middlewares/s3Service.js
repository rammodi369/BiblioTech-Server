// // // const { S3 } = require("aws-sdk");
// // // const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// // // const uuid = require("uuid").v4;

// // // exports.s3Uploadv2 = async (files) => {
// // //   const s3 = new S3();

// // //   const params = files.map((file) => {
// // //     return {
// // //       Bucket: process.env.AWS_BUCKET_NAME,
// // //       Key: `uploads/${uuid()}-${file.originalname}`,
// // //       Body: file.buffer,
// // //     };
// // //   });

// // //   return await Promise.all(params.map((param) => s3.upload(param).promise()));
// // // };

// // // exports.s3Uploadv3 = async (files) => {
// // //   const s3client = new S3Client();

// // //   const params = files.map((file) => {
// // //     return {
// // //       Bucket: process.env.AWS_BUCKET_NAME,
// // //       Key: `uploads/${uuid()}-${file.originalname}`,
// // //       Body: file.buffer,
// // //     };
// // //   });

// // //   return await Promise.all(
// // //     params.map((param) => s3client.send(new PutObjectCommand(param)))
// // //   );
// // // };
// // const { S3 } = require("aws-sdk");
// // const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// // const uuid = require("uuid").v4;

// // console.log('Initializing S3 upload utilities...');

// // // Check AWS credentials and bucket name
// // if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
// //   console.error('AWS credentials or bucket name missing in environment variables');
// //   throw new Error('AWS configuration missing');
// // }

// // // V2 Upload (using AWS SDK v2)
// // exports.s3Uploadv2 = async (files) => {
// //   console.log('Starting s3Uploadv2 with files:', files.map(f => f.originalname));
  
// //   try {
// //     const s3 = new S3({
// //       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// //       region: process.env.AWS_REGION || 'us-east-1'
// //     });

// //     const params = files.map((file) => {
// //       const key = `uploads/${uuid()}-${file.originalname}`;
// //       console.log(`Preparing upload for ${file.originalname} with key ${key}`);
      
// //       return {
// //         Bucket: process.env.AWS_BUCKET_NAME,
// //         Key: key,
// //         Body: file.buffer,
// //         ContentType: file.mimetype
// //       };
// //     });

// //     const results = await Promise.all(params.map((param) => {
// //       console.log(`Uploading ${param.Key} to S3`);
// //       return s3.upload(param).promise();
// //     }));

// //     console.log('s3Uploadv2 completed successfully:', results);
// //     return results;
// //   } catch (error) {
// //     console.error('Error in s3Uploadv2:', error);
// //     throw error;
// //   }
// // };

// // // V3 Upload (using AWS SDK v3)
// // exports.s3Uploadv3 = async (files) => {
// //   console.log('Starting s3Uploadv3 with files:', files.map(f => f.originalname));
  
// //   try {
// //     const s3client = new S3Client({
// //       region: process.env.AWS_REGION || 'us-east-1',
// //       credentials: {
// //         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
// //         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// //       }
// //     });

// //     const params = files.map((file) => {
// //       const key = `uploads/${uuid()}-${file.originalname}`;
// //       console.log(`Preparing upload for ${file.originalname} with key ${key}`);
      
// //       return {
// //         Bucket: process.env.AWS_BUCKET_NAME,
// //         Key: key,
// //         Body: file.buffer,
// //         ContentType: file.mimetype
// //       };
// //     });

// //     const results = await Promise.all(
// //       params.map((param) => {
// //         console.log(`Uploading ${param.Key} to S3`);
// //         return s3client.send(new PutObjectCommand(param));
// //       })
// //     );

// //     console.log('s3Uploadv3 completed successfully:', results);
// //     return results;
// //   } catch (error) {
// //     console.error('Error in s3Uploadv3:', error);
// //     throw error;
// //   }
// // };

// // console.log('S3 upload utilities initialized');
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
// const uuid = require("uuid").v4;

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION || 'us-east-1',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//   }
// });

// exports.uploadFileToS3 = async (file) => {
//     console.log('Starting uploadFileToS3 with file:', {
//       originalname: file.originalname,
//       mimetype: file.mimetype,
//       size: file.size
//     });
  
//     try {
//       // Validate environment variables first
//       if (!process.env.AWS_BUCKET_NAME) {
//         throw new Error('AWS_BUCKET_NAME is not defined in environment variables');
//       }
  
//       console.log('AWS Configuration:', {
//         bucket: process.env.AWS_BUCKET_NAME,
//         region: process.env.AWS_REGION || 'us-east-1 (default)',
//         credentials: {
//           accessKeyId: process.env.AWS_ACCESS_KEY_ID ? '***present***' : 'MISSING',
//           secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? '***present***' : 'MISSING'
//         }
//       });
  
//       const key = `books/${uuid()}-${file.originalname}`;
//       console.log('Generated S3 key:', key);
      
//       const params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: key,
//         Body: file.buffer,
//         ContentType: file.mimetype
//       };
  
//       console.log('Attempting S3 upload with params:', {
//         Bucket: params.Bucket,
//         Key: params.Key,
//         ContentType: params.ContentType,
//         Body: `Buffer(${file.buffer.length} bytes)`
//       });
  
//       const startTime = Date.now();
//       await s3Client.send(new PutObjectCommand(params));
//       const duration = Date.now() - startTime;
      
//       console.log(`S3 upload successful (${duration}ms)`);
  
//       const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`;
//       console.log('Generated file URL:', fileUrl);
      
//       return {
//         key,
//         url: fileUrl
//       };
//     } catch (error) {
//       console.error('Detailed S3 Upload Error:', {
//         message: error.message,
//         name: error.name,
//         stack: error.stack,
//         code: error.code,
//         time: new Date().toISOString(),
//         s3Details: {
//           bucket: process.env.AWS_BUCKET_NAME,
//           attemptedKey: key,
//           region: process.env.AWS_REGION
//         },
//         awsMetadata: error.$metadata || 'No metadata available'
//       });
  
//       // Create a more descriptive error
//       const uploadError = new Error(`Failed to upload file to S3: ${error.message}`);
//       uploadError.originalError = error;
//       uploadError.s3Details = {
//         bucket: process.env.AWS_BUCKET_NAME,
//         attemptedKey: key,
//         region: process.env.AWS_REGION
//       };
      
//       throw uploadError;
//     }
//   };
// const { S3 } = require("aws-sdk");
// require("dotenv").config();

// // const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const uuid = require("uuid").v4;

// // exports.s3Uploadv2 = async (files) => {
// //   const s3 = new S3();

// //   const params = files.map((file) => {
// //     return {
// //       Bucket: process.env.AWS_BUCKET_NAME,
// //       Key: `uploads/${uuid()}-${file.originalname}`,
// //       Body: file.buffer,
// //     };
// //   });

// //   return await Promise.all(params.map((param) => s3.upload(param).promise()));
// // };

// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// exports.uploadFileToS3 = async (file) => {
//   const s3client = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     },
//   });

//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `uploads/${uuid()}-${file.originalname}`,
//     Body: file.buffer,
//   };

//   return await s3client.send(new PutObjectCommand(params));
// };
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.uploadFileToS3 = async (file) => {
  try {
    if (!file) {
      console.error("❌ No file provided for upload.");
      throw new Error("No file provided");
    }

    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    if (!bucketName) {
      console.error("❌ Missing AWS_S3_BUCKET_NAME in environment variables.");
      throw new Error("Missing AWS_S3_BUCKET_NAME in environment variables.");
    }

    const fileKey = `uploads/${Date.now()}_${file.originalname}`;

    console.log("📦 Starting S3 upload...");
    console.log(`🪣 Bucket: ${bucketName}`);
    console.log(`📄 File Key: ${fileKey}`);

    const params = {
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await s3.upload(params).promise();

    console.log("✅ Upload successful!");
    console.log("🌐 File URL:", data.Location);

    return data.Location;
  } catch (error) {
    console.error("❌ S3 Upload Error:", error.message);
    throw error;
  }
};