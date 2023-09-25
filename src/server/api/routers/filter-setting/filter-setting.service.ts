import { prisma } from "~/server/db"
import type { GetFilterSettingByWorkspaceSlugInput } from "~/server/api/routers/filter-setting/dto/filter-setting.input"
import type { UpsertFilterInput } from "~/server/api/routers/filter-setting/dto/filter-setting.input"
import type { z } from "zod"
import type { Session } from "next-auth"

export const getFilterSettingByWorkspaceSlug = (
  input: z.infer<typeof GetFilterSettingByWorkspaceSlugInput>,
  session: Session
) =>
  prisma.filterSetting.findFirst({
    where: {
      workspace: {
        name: input.workspaceSlug,
      },
      owner: {
        id: session.user.id,
      },
    },
    select: {
      setting: true,
    },
  })

export const upsertFilter = async (
  input: z.infer<typeof UpsertFilterInput>,
  session: Session
) => {
  const userId = session.user.id

  const settingId = await prisma.filterSetting.findFirst({
    where: {
      workspace: {
        slug: input.workspaceSlug,
      },
      owner: {
        id: userId,
      },
    },
  })

  if (!settingId) {
    return prisma.filterSetting.create({
      data: {
        workspace: {
          connect: {
            slug: input.workspaceSlug,
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

  return prisma.filterSetting.update({
    where: {
      id: settingId.id,
    },
    data: {
      setting: input.setting,
    },
  })
}
