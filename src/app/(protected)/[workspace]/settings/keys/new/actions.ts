"use server"

import * as apiKeyRouter from "~/server/api/routers/api-key/api-key.router"
import { createAction } from "~/server/api/trpc"

export const createApiKeyAction = createAction(apiKeyRouter.createApiKey)

export const deleteApiKeyAction = createAction(apiKeyRouter.deleteApiKeyById)
