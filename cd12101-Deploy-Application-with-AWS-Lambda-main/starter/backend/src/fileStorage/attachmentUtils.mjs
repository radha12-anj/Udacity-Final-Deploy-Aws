import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const bucketName = process.env.ATTACHMENTS_S3_BUCKET

const s3Client = new S3Client({})

export async function getUploadUrl(todoId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId,

    ContentType: "image/png"
  })

  return await getSignedUrl(s3Client, command, {
    expiresIn: 300
  })
}