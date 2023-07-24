import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { S3 } from "@aws-sdk/client-s3"
import { env } from "~/env.mjs"
import { createPresignedPost } from "@aws-sdk/s3-presigned-post"
import { nanoid } from "nanoid"
import mime from "mime-types"

const client = new S3({
  region: env.S3_UPLOAD_REGION,
  credentials: {
    accessKeyId: env.S3_UPLOAD_KEY,
    secretAccessKey: env.S3_UPLOAD_SECRET,
  },
})

export const createPresignedUrl = protectedProcedure
  .input(
    z.object({
      filetype: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const ext = mime.extension(input.filetype)
    let filename = `${nanoid()}`
    if (ext) {
      filename += `.${ext}`
    }
    return await createPresignedPost(client, {
      Bucket: env.S3_UPLOAD_BUCKET,
      Key: filename,
      Expires: 600,
      Fields: {
        "Content-Type": input.filetype,
      },
      Conditions: [
        ["content-length-range", 0, 1048576], // up to 1 MB
      ],
    })
  })

export const teamRouter = createTRPCRouter({})
