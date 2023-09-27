"use server"

import * as teamRouter from "~/server/api/routers/team/team.router"
import * as workspaceRouter from "~/server/api/routers/workspace/workspace.router"
import { createAction } from "~/server/api/trpc"

export const inviteMemberToWorkspaceAction = createAction(
  workspaceRouter.inviteMemberToWorkspace
)

export const removeMemberOnWorkspaceByIdAction = createAction(
  workspaceRouter.removeMemberOnWorkspaceById
)

export const updateMemberRoleOnWorkspaceAction = createAction(
  workspaceRouter.updateMemberRoleOnWorkspace
)

export const createTeamAction = createAction(teamRouter.createTeam)

export const inviteMemberToTeamAction = createAction(
  teamRouter.inviteMemberToTeam
)

export const deleteTeamByIdAction = createAction(teamRouter.deleteTeamById)

export const deleteMemberOnTeamByIdAction = createAction(
  teamRouter.deleteTeamMemberById
)
