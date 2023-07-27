"use server"

import { renameWorkspace } from "~/server/api/routers/workspace"
import { createAction } from "~/server/api/trpc"

export const renameWorkspaceAction = createAction(renameWorkspace)
