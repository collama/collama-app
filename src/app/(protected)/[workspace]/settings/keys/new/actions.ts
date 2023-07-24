"use server"

import { createAction } from "~/server/api/trpc"
import { createApiKey } from "~/server/api/routers/api-key"

export const createApiKeyAction = createAction(createApiKey)
