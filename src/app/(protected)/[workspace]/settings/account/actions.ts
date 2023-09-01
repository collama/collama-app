"use server"

import { createAction } from "~/server/api/trpc"
import { createPresignedUrl } from "~/server/api/routers/storage"

export const createPresignedUrlAction = createAction(createPresignedUrl)
