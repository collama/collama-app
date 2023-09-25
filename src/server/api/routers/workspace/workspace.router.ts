import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import * as workspaceService from "~/server/api/routers/workspace/workspace.service"
import {
  CreateWorkspaceInput,
  DeleteMemberOnWorkspaceByIdInput,
  GetBySlugInput,
  GetBySlugPublicInput,
  GetMemberOnWorkspaceBySlugInput,
  GetMembersOnWorkspaceInput,
  InviteMemberToWorkspaceInput,
  RemoveMemberOnWorkspaceByIdInput,
  RenameWorkspaceInput,
  UpdateMemberRoleInWorkspaceInput,
} from "~/server/api/routers/workspace/dto/workspace.input"

export const createWorkspace = protectedProcedure
  .input(CreateWorkspaceInput)
  .mutation(({ ctx, input }) =>
    workspaceService.createWorkspace(input, ctx.session)
  )

export const renameWorkspace = protectedProcedure
  .input(RenameWorkspaceInput)
  .mutation(({ ctx, input }) =>
    workspaceService.renameWorkspace(input, ctx.session)
  )

export const inviteMemberToWorkspace = protectedProcedure
  .input(InviteMemberToWorkspaceInput)
  .mutation(({ input }) => workspaceService.inviteMemberToWorkspace(input))

export const updateMemberRoleOnWorkspace = protectedProcedure
  .input(UpdateMemberRoleInWorkspaceInput)
  .mutation(({ ctx, input }) =>
    workspaceService.updateMemberRoleInWorkspace(input, ctx.session)
  )

export const removeMemberOnWorkspaceById = protectedProcedure
  .input(RemoveMemberOnWorkspaceByIdInput)
  .mutation(({ ctx, input }) =>
    workspaceService.removeMemberOnWorkspaceById(input, ctx.session)
  )

export const deleteMemberOnWorkspaceById = protectedProcedure
  .input(DeleteMemberOnWorkspaceByIdInput)
  .mutation(({ input }) => workspaceService.deleteMemberOnWorkspaceById(input))

const count = protectedProcedure.query(({ ctx }) =>
  workspaceService.count(ctx.session)
)

const getFirst = protectedProcedure.query(({ ctx }) =>
  workspaceService.getFirst(ctx.session)
)

const getBySlugPublic = publicProcedure
  .input(GetBySlugPublicInput)
  .query(({ input }) => workspaceService.getBySlugPublic(input))

const getBySlug = protectedProcedure
  .input(GetBySlugInput)
  .query(({ ctx, input }) => workspaceService.getBySlug(input, ctx.session))

const getAll = protectedProcedure.query(({ ctx }) =>
  workspaceService.getAll(ctx.session)
)

const getMembersOnWorkspace = protectedProcedure
  .input(GetMembersOnWorkspaceInput)
  .query(({ ctx, input }) =>
    workspaceService.getMembersOnWorkspace(input, ctx.session)
  )

export const getMemberOnWorkspaceBySlug = protectedProcedure
  .input(GetMemberOnWorkspaceBySlugInput)
  .query(({ ctx, input }) =>
    workspaceService.getMemberOnWorkspaceBySlug(input, ctx.session)
  )

export const workspaceTRPCRouter = createTRPCRouter({
  count,
  getFirst,
  getBySlugPublic,
  getBySlug,
  getAll,
  getMembersOnWorkspace,
  getMemberOnWorkspaceBySlug,
})
