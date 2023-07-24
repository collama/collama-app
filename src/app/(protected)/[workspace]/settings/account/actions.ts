"use server"

import { createAction } from "~/server/api/trpc"
import { createPresignedUrl } from "~/server/api/routers/storage"
import { updateUserAvatar } from "~/server/api/routers/user"

export const createPresignedUrlAction = createAction(createPresignedUrl)

export const updateUserAvatarAction = createAction(updateUserAvatar)
