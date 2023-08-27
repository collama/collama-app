"use server"

import { createAction } from "~/server/api/trpc"
import {
  inviteMemberToWorkspace,
  removeMember,
  updateRole,
} from "~/server/api/routers/workspace"
import { createTeam, inviteMemberToTeam } from "~/server/api/routers/team"

export const inviteMemberToWorkspaceAction = createAction(
  inviteMemberToWorkspace
)
export const removeMemberAction = createAction(removeMember)
export const updateMemberRoleAction = createAction(updateRole)
export const createTeamAction = createAction(createTeam)
export const inviteMemberToTeamAction = createAction(inviteMemberToTeam)
