import {
  canAccessTeamMiddleware,
  TeamIdInput,
  TeamSlugInput,
} from "~/server/api/middlewares/permission/team-permission"
import {
  canAccessWorkspaceMiddleware,
  WorkspaceSlugInput,
} from "~/server/api/middlewares/permission/workspace-permission"
import {
  TaskProtectedReaders,
  TaskProtectedWriters,
} from "~/server/api/providers/permission/role"
import {
  TeamProtectedManagers,
  TeamProtectedMembers,
} from "~/server/api/providers/permission/team-role"
import {
  CreateTeamInput,
  InviteMemberToTeamInput,
  RemoveMemberByIdInput,
} from "~/server/api/routers/team/dto/team.input"
import * as teamService from "~/server/api/routers/team/team.service"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const createTeam = protectedProcedure
  .input(CreateTeamInput)
  .mutation(({ input, ctx }) =>
    teamService.createTeam(ctx.prisma, input, ctx.session)
  )

export const inviteMemberToTeam = protectedProcedure
  .input(TeamIdInput)
  .meta({
    allowedTeamRoles: TeamProtectedManagers,
  })
  .use(canAccessTeamMiddleware)
  .input(InviteMemberToTeamInput)
  .mutation(({ input, ctx }) =>
    teamService.inviteMemberToTeam({
      ...ctx,
      input,
    })
  )

export const deleteTeamById = protectedProcedure
  .input(TeamIdInput)
  .meta({
    allowedTeamRoles: TeamProtectedManagers,
  })
  .use(canAccessTeamMiddleware)
  .input(TeamIdInput)
  .mutation(({ input, ctx }) =>
    teamService.deleteTeamById({
      ...ctx,
      input,
    })
  )

export const removeTeamMemberById = protectedProcedure
  .input(TeamIdInput)
  .meta({
    allowedTeamRoles: TeamProtectedManagers,
  })
  .use(canAccessTeamMiddleware)
  .input(RemoveMemberByIdInput)
  .mutation(({ input, ctx }) =>
    teamService.removeMemberById({
      ...ctx,
      input,
    })
  )

const getTeamsByWorkspaceSlug = protectedProcedure
  .input(WorkspaceSlugInput)
  .meta({
    allowedRoles: TaskProtectedReaders,
  })
  .use(canAccessWorkspaceMiddleware)
  .input(WorkspaceSlugInput)
  .query(({ input, ctx }) =>
    teamService.getTeamsByWorkspaceSlug({
      ...ctx,
      input,
    })
  )

const getMembersByTeamId = protectedProcedure
  .input(TeamIdInput)
  .meta({
    allowedTeamRoles: TeamProtectedMembers,
  })
  .use(canAccessTeamMiddleware)
  .input(TeamIdInput)
  .query(({ input, ctx }) =>
    teamService.getMembersByTeamId({
      ...ctx,
      input,
    })
  )

const getTeamBySlug = protectedProcedure
  .input(TeamSlugInput)
  .meta({
    allowedTeamRoles: TeamProtectedMembers,
  })
  .use(canAccessTeamMiddleware)
  .input(TeamSlugInput)
  .query(({ input, ctx }) =>
    teamService.getTeamBySlug({
      ...ctx,
      input,
    })
  )

export const teamTRPCRouter = createTRPCRouter({
  getTeamsByWorkspaceSlug,
  getMembersByTeamId,
  getTeamBySlug,
})
