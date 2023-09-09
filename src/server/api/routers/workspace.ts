import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { z } from "zod"
import { zId } from "~/common/validation"
import { InviteStatus, Role } from "@prisma/client"
import {
  LastOwnerCanNotRemoved,
  MemberNotFound,
  Unauthorized,
  UserNotFound,
} from "~/libs/constants/errors"

export const createWorkspace = protectedProcedure
  .input(
    z.object({
      name: zId,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) throw UserNotFound

    return ctx.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: input.name,
          slug: input.name.toLowerCase(),
          ownerId: user.id,
          private: false,
        },
      })

      await tx.membersOnWorkspaces.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          role: Role.Owner,
          status: InviteStatus.Accepted,
        },
      })

      return workspace
    })
  })

export const renameWorkspace = protectedProcedure
  .input(
    z.object({
      oldName: zId,
      newName: zId,
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) throw UserNotFound

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

const getMembersFromWorkspace = protectedProcedure
  .input(
    z.object({
      name: zId,
    })
  )
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw UserNotFound
    }

    return ctx.prisma.membersOnWorkspaces.findMany({
      where: {
        workspace: {
          name: input.name,
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

export const inviteMemberToWorkspace = protectedProcedure
  .input(
    z.object({
      workspaceName: zId,
      email: z.string().email(),
      role: z.nativeEnum(Role),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.membersOnWorkspaces.create({
      data: {
        role: input.role,
        workspace: {
          connect: {
            name: input.workspaceName,
          },
        },
        user: {
          connect: {
            email: input.email,
          },
        },
        status: InviteStatus.Accepted,
      },
    })
  })

export const updateMemberRoleInWorkspace = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      role: z.nativeEnum(Role),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const member = await ctx.prisma.membersOnWorkspaces.findFirst({
      where: {
        id: input.id,
      },
    })
    if (!member) throw MemberNotFound

    const userId = ctx.session.user.id
    const owner = await ctx.prisma.membersOnWorkspaces.findFirst({
      where: {
        userId,
      },
    })

    if (!owner) throw UserNotFound
    if (owner.role !== Role.Owner) throw Unauthorized

    if (owner.role === Role.Owner) {
      const member = await ctx.prisma.membersOnWorkspaces.findUnique({
        where: {
          id: input.id,
        },
      })

      if (member?.id === userId) throw LastOwnerCanNotRemoved
    }

    return ctx.prisma.membersOnWorkspaces.update({
      where: {
        id: input.id,
      },
      data: {
        role: input.role,
      },
    })
  })

export const removeMemberFromWorkspace = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    const owner = await ctx.prisma.membersOnWorkspaces.findFirst({
      where: {
        userId,
      },
    })

    if (!owner) throw UserNotFound
    if (owner.role !== Role.Owner) throw Unauthorized

    if (owner.role === Role.Owner) {
      const member = await ctx.prisma.membersOnWorkspaces.findUnique({
        where: {
          id: input.id,
        },
      })

      if (member?.id === userId) throw Unauthorized
    }

    return ctx.prisma.membersOnWorkspaces.delete({
      where: {
        id: input.id,
      },
    })
  })

export const getUserInWorkspace = protectedProcedure
  .input(
    z.object({
      name: zId,
    })
  )
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.user.id
    return ctx.prisma.membersOnWorkspaces.findFirst({
      where: {
        workspace: {
          name: input.name,
        },
        userId,
      },
    })
  })

export const workspaceRouter = createTRPCRouter({
  count: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspace.count({
      where: {
        ownerId: ctx.session.user.id,
      },
    })
  }),
  getFirst: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspace.findFirst({
      where: {
        ownerId: ctx.session.user.id,
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
          ownerId: ctx.session.user.id,
        },
      })
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspace.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    })
  }),
  getMembersFromWorkspace,
  getUserInWorkspace,
})

export const deleteMemberOnWorkspace = protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    return ctx.prisma.$transaction(async (tx) => {
      const workspaceMember = await tx.membersOnWorkspaces.delete({
        where: {
          id: input.id,
        },
      })

      await tx.membersOnTasks.deleteMany({
        where: {
          userId: workspaceMember.userId,
        },
      })

      return workspaceMember
    })
  })
