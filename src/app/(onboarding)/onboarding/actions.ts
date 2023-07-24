"use server"

import { createAction } from "~/server/api/trpc"
import { createWorkspace } from "~/server/api/routers/workspace"

export const createWorkspaceAction = createAction(createWorkspace)
