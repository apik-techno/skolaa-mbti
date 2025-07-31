import { S3Client } from '@aws-sdk/client-s3'
import { env } from '../env.mjs'

const bucketClient = new S3Client({
  region: env.AWS_BUCKET_REGION,
  endpoint: env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: env.AWS_ACCESS_APP_KEY,
    secretAccessKey: env.AWS_SECRET_APP_KEY,
  },
})

export default bucketClient
