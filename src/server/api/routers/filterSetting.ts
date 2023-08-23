import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { zId } from "~/common/validation"

export const upsertFilter = protectedProcedure
  .input(
    z.object({
      workspaceName: zId,
      setting: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const userId = ctx.session.right.userId
    const settingId = await ctx.prisma.filterSetting.findFirst({
      where: {
        workspace: {
          name: input.workspaceName,
        },
        owner: {
          id: userId,
        },
      },
    })

    if (!settingId) {
      return ctx.prisma.filterSetting.create({
        data: {
          workspace: {
            connect: {
              name: input.workspaceName,
            },
          },
          owner: {
            connect: {
              id: userId,
            },
          },
          setting: input.setting,
        },
      })
    }

    return ctx.prisma.filterSetting.update({
      where: {
        id: settingId.id,
      },
      data: {
        setting: input.setting,
      },
    })
  })

export const filterSettingRouter = createTRPCRouter({
  getFilterSettingByWorkspaceName: protectedProcedure
    .input(z.object({ workspaceName: z.string().nonempty() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.right.userId
      return ctx.prisma.filterSetting.findFirst({
        where: {
          workspace: {
            name: input.workspaceName,
          },
          owner: {
            id: userId,
          },
        },
        select: {
          setting: true,
        },
      })
    }),
})
