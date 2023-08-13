"use server"

import { createAction } from "~/server/api/trpc"
import {
  inviteMember,
  removeMember,
  updateRole,
} from "~/server/api/routers/workspace"

export const inviteMemberAction = createAction(inviteMember)
export const removeMemberAction = createAction(removeMember)
export const updateMemberRoleAction = createAction(updateRole)
