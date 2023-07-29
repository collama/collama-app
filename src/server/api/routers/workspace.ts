import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { z } from "zod"
import { zId } from "~/common/validation"
import { UserNotFound } from "~/common/errors"
import { InviteStatus, Role } from "@prisma/client"

export const createWorkspace = protectedProcedure
  .input(
    z.object({
      workspaceName: zId,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const email = ctx.session.right.email
    const user = await ctx.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw UserNotFound
    }

    const workspace = await ctx.prisma.workspace.create({
      data: {
        name: input.workspaceName,
        ownerId: user.id,
        private: false,
      },
    })

    await ctx.prisma.membersOnWorkspaces.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: Role.Owner,
        status: InviteStatus.Accepted,
      },
    })

    return workspace
  })

export const renameWorkspace = protectedProcedure
  .input(
    z.object({
      oldName: zId,
      newName: zId,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const email = ctx.session.right.email
    const user = await ctx.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw UserNotFound
    }

    return ctx.prisma.workspace.update({
      where: {
        name: input.oldName,
        ownerId: user.id,
      },
      data: {
        name: input.newName,
      },
    })
  })

const getMembers = protectedProcedure
  .input(
    z.object({
      workspaceName: zId,
    })
  )
  .query(async ({ ctx, input }) => {
    const email = ctx.session.right.email
    const user = await ctx.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw UserNotFound
    }

    return ctx.prisma.membersOnWorkspaces.findMany({
      where: {
        workspace: {
          name: input.workspaceName,
        },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    })
  })

export const workspaceRouter = createTRPCRouter({
  count: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspace.count({
      where: {
        ownerId: ctx.session.right.userId,
      },
    })
  }),
  getFirst: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspace.findFirst({
      where: {
        ownerId: ctx.session.right.userId,
      },
    })
  }),
  getByNamePublic: publicProcedure
    .input(
      z.object({
        workspaceName: zId,
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.workspace.findFirst({
        where: {
          name: input.workspaceName,
          private: false,
        },
      })
    }),
  getByName: protectedProcedure
    .input(
      z.object({
        workspaceName: z.string().nonempty(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.workspace.findFirst({
        where: {
          name: input.workspaceName,
          ownerId: ctx.session.right.userId,
        },
      })
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspace.findMany({
      where: {
        ownerId: ctx.session.right.userId,
      },
    })
  }),
  getMembers,
})
