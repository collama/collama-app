"use server"

import { createAction } from "~/server/api/trpc"
import {
  createWorkspace,
  deleteMemberOnWorkspace,
} from "~/server/api/routers/workspace"

export const createWorkspaceAction = createAction(createWorkspace)
export const deleteMemberOnWorkspaceAction = createAction(
  deleteMemberOnWorkspace
)
