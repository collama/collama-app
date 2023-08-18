"use server"

import { createAction } from "~/server/api/trpc"
import {
  getUserInWorkspace,
  inviteMember,
  removeMember,
  updateRole,
} from "~/server/api/routers/workspace"
import { createTeam } from "~/server/api/routers/team"

export const inviteMemberAction = createAction(inviteMember)
export const removeMemberAction = createAction(removeMember)
export const updateMemberRoleAction = createAction(updateRole)
export const createTeamAction = createAction(createTeam)
