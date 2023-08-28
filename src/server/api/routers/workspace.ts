import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import { z } from "zod"
import { zId } from "~/common/validation"
import { CanNotRemoveOwner, Unauthorized, UserNotFound } from "~/common/errors"
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
    const userId = ctx.session.right.userId
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
          name: input.workspaceName,
        },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        team: {
          select: {
            name: true,
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
          connectOrCreate: {
            where: {
              email: input.email,
            },
            create: {
              email: input.email,
              username: "",
            },
          },
        },
        status: InviteStatus.Accepted
      },
    })
  })

export const updateRole = protectedProcedure
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

    if (!member) {
      throw new Error("member not found")
    }

    const userId = ctx.session.right.userId
    const owner = await ctx.prisma.membersOnWorkspaces.findFirst({
      where: {
        userId,
      },
    })

    if (!owner) {
      throw UserNotFound
    }

    if (owner.role !== Role.Owner) {
      throw Unauthorized
    }

    if (owner.role === Role.Owner) {
      const member = await ctx.prisma.membersOnWorkspaces.findUnique({
        where: {
          id: input.id,
        },
      })

      if (member?.userId === userId) {
        throw new Error(`can not update owner's role`)
      }
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

export const removeMember = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.session.right.userId
    const owner = await ctx.prisma.membersOnWorkspaces.findFirst({
      where: {
        userId,
      },
    })

    if (!owner) {
      throw UserNotFound
    }

    if (owner.role !== Role.Owner) {
      throw Unauthorized
    }

    if (owner.role === Role.Owner) {
      const member = await ctx.prisma.membersOnWorkspaces.findUnique({
        where: {
          id: input.id,
        },
      })

      if (member?.userId === userId) {
        throw CanNotRemoveOwner
      }
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
      workspaceName: zId,
    })
  )
  .query(async ({ ctx, input }) => {
    const session = ctx.session.right
    return ctx.prisma.membersOnWorkspaces.findFirst({
      where: {
        workspace: {
          name: input.workspaceName,
        },
        userId: session.userId,
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
  inviteMember: inviteMemberToWorkspace,
  getUserInWorkspace,
})
