"use server"

import { createAction } from "~/server/api/trpc"
import {
  inviteMemberToWorkspace,
  removeMemberFromWorkspace,
  updateMemberRoleInWorkspace,
} from "~/server/api/routers/workspace"
import {
  createTeam,
  deleteTeam,
  deleteTeamMember,
  inviteMemberToTeam,
} from "~/server/api/routers/team"

export const inviteMemberToWorkspaceAction = createAction(
  inviteMemberToWorkspace
)
export const removeMemberAction = createAction(removeMemberFromWorkspace)
export const updateMemberRoleAction = createAction(updateMemberRoleInWorkspace)
export const createTeamAction = createAction(createTeam)
export const inviteMemberToTeamAction = createAction(inviteMemberToTeam)
export const deleteTeamAction = createAction(deleteTeam)
export const deleteMemberOnTeamAction = createAction(deleteTeamMember)
