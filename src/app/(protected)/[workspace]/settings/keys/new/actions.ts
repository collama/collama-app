"use server"

import { createAction } from "~/server/api/trpc"
import * as apiKeyRouter from "~/server/api/routers/api-key/api-key.router"

export const createApiKeyAction = createAction(apiKeyRouter.createApiKey)

export const deleteApiKeyAction = createAction(apiKeyRouter.deleteApiKeyById)
