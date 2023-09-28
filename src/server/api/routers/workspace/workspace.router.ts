import {
  canAccessWorkspaceMiddleware,
  WorkspaceIdInput,
  WorkspaceSlugInput,
} from "~/server/api/middlewares/permission/workspace-permission"
import {
  TaskProtectedManagers,
  TaskProtectedReaders,
} from "~/server/api/providers/permission/role"
import {
  CreateWorkspaceInput,
  InviteMemberToWorkspaceInput,
  RemoveWorkspaceMemberInput,
  UpdateMemberRoleInWorkspaceInput,
} from "~/server/api/routers/workspace/dto/workspace.input"
import * as workspaceService from "~/server/api/routers/workspace/workspace.service"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"

export const createWorkspace = protectedProcedure
  .input(CreateWorkspaceInput)
  .mutation(({ ctx, input }) =>
    workspaceService.createWorkspace({
      input,
      session: ctx.session,
      prisma: ctx.prisma,
    })
  )

export const inviteMemberToWorkspace = protectedProcedure
  .input(WorkspaceIdInput)
  .meta({
    allowedRoles: TaskProtectedManagers,
  })
  .use(canAccessWorkspaceMiddleware)
  .input(InviteMemberToWorkspaceInput)
  .mutation(({ input, ctx }) =>
    workspaceService.inviteMemberToWorkspace({
      input,
      session: ctx.session,
      prisma: ctx.prisma,
      workspace: ctx.workspace,
    })
  )

export const updateMemberRoleOnWorkspace = protectedProcedure
  .input(WorkspaceSlugInput)
  .meta({
    allowedRoles: TaskProtectedManagers,
  })
  .use(canAccessWorkspaceMiddleware)
  .input(UpdateMemberRoleInWorkspaceInput)
  .mutation(({ ctx, input }) => {
    return workspaceService.updateMemberRoleInWorkspace({
      input,
      session: ctx.session,
      prisma: ctx.prisma,
      workspace: ctx.workspace,
    })
  })

export const removeMemberOnWorkspaceById = protectedProcedure
  .input(WorkspaceIdInput)
  .meta({
    allowedRoles: TaskProtectedManagers,
  })
  .use(canAccessWorkspaceMiddleware)
  .input(RemoveWorkspaceMemberInput)
  .mutation(({ ctx, input }) => {
    return workspaceService.removeMemberOnWorkspaceById({
      input,
      session: ctx.session,
      prisma: ctx.prisma,
      workspace: ctx.workspace,
    })
  })

const count = protectedProcedure.query(({ ctx }) => {
  return workspaceService.count({
    session: ctx.session,
    prisma: ctx.prisma,
  })
})

const getBySlug = protectedProcedure
  .input(WorkspaceSlugInput)
  .meta({
    allowedRoles: TaskProtectedReaders,
  })
  .use(canAccessWorkspaceMiddleware)
  .input(WorkspaceSlugInput)
  .query(({ ctx, input }) => {
    return workspaceService.getBySlug({
      prisma: ctx.prisma,
      input,
    })
  })

const belongToWorkspaces = protectedProcedure.query(({ ctx }) => {
  return workspaceService.belongToWorkspaces({
    session: ctx.session,
    prisma: ctx.prisma,
  })
})

const getMembersOnWorkspace = protectedProcedure
  .input(WorkspaceIdInput)
  .meta({
    allowedRoles: TaskProtectedReaders,
  })
  .use(canAccessWorkspaceMiddleware)
  .input(WorkspaceIdInput)
  .query(({ ctx, input }) => {
    return workspaceService.getMembersOnWorkspace({
      input,
      session: ctx.session,
      prisma: ctx.prisma,
      workspace: ctx.workspace,
    })
  })

export const workspaceTRPCRouter = createTRPCRouter({
  count,
  getBySlug,
  getAll: belongToWorkspaces,
  getMembersOnWorkspace,
})
