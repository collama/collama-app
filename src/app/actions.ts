"use server"

import { createAction } from "~/server/api/trpc"
import * as workspaceRouter from "~/server/api/routers/workspace/workspace.router"

export const createWorkspaceAction = createAction(
  workspaceRouter.createWorkspace
)
export const removeMemberOnWorkspaceAction = createAction(
  workspaceRouter.removeMemberOnWorkspaceById
)
