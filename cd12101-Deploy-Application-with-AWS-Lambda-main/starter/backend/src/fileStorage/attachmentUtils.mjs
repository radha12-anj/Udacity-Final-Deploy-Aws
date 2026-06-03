import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

import AWSXRay from 'aws-xray-sdk'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
})

const bucketName = process.env.ATTACHMENTS_S3_BUCKET

// X-Ray instrumented S3 client
const XAWS = AWSXRay.captureAWSv3Client
const s3Client = XAWS(new S3Client({}))

export async function getUploadUrl(todoId) {

  logger.info('Generating S3 upload URL', {
    todoId,
    bucket: bucketName
  })

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId,
    ContentType: "image/png"
  })

  const url = await getSignedUrl(s3Client, command, {
    expiresIn: 300
  })

  logger.info('Upload URL generated successfully', {
    todoId
  })

  return url
}