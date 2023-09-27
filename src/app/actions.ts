"use server"

import * as workspaceRouter from "~/server/api/routers/workspace/workspace.router"
import { createAction } from "~/server/api/trpc"

export const createWorkspaceAction = createAction(
  workspaceRouter.createWorkspace
)
export const removeMemberOnWorkspaceAction = createAction(
  workspaceRouter.removeMemberOnWorkspaceById
)
