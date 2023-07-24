import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { zId } from "~/common/validation"
import { UserNotFound } from "~/common/errors"
import { InviteStatus, Role } from "@prisma/client"
import { createUserIfNotExists } from "~/server/api/routers/user"

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
        planId: "",
        ownerId: user.id,
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

export const workspaceRouter = createTRPCRouter({
  count: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspace.count({
      where: {
        owner: {
          email: ctx.session.right.email,
        },
      },
    })
  }),
  getFirst: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workspace.findFirst({
      where: {
        owner: {
          email: ctx.session.right.email,
        },
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
          owner: {
            email: ctx.session.right.email,
          },
        },
      })
    }),
})
