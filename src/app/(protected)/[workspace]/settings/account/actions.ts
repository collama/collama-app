"use server"

import { createPresignedUrl } from "~/server/api/routers/storage"
import { createAction } from "~/server/api/trpc"

export const createPresignedUrlAction = createAction(createPresignedUrl)
