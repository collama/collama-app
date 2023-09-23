"use server"

import { createAction } from "~/server/api/trpc"
import { createApiKey, deleteApiKeyById } from "~/server/api/routers/api-key"

export const createApiKeyAction = createAction(createApiKey)

export const deleteApiKeyAction = createAction(deleteApiKeyById)
