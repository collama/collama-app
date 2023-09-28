import { experimental_standaloneMiddleware, TRPCError } from "@trpc/server"
import { z } from "zod"
import { zSlug } from "~/common/validation"
import type { Context, Meta } from "~/server/api/trpc"
import { NoPermission } from "~/server/errors/task.error"

export const TeamSlugInput = z.object({
  workspaceSlug: zSlug,
  slug: zSlug,
})

export type TeamSlugInput = z.infer<typeof TeamSlugInput>

export const TeamIdInput = z.object({
  id: z.string(),
})

export type TeamIdInput = z.infer<typeof TeamIdInput>

export const canAccessTeamMiddleware = experimental_standaloneMiddleware<{
  ctx: Context // defaults to 'object' if not defined
  input: {
    id?: string
    slug?: string
    workspaceSlug?: string
  } // defaults to 'unknown' if not defined
  meta: Meta // not defined here, defaults to 'object | undefined'
}>().create(async ({ ctx, next, input, meta }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "session not found",
      cause: "",
    })
  }

  const permission = await ctx.prisma.team.canUserAccess({
    id: input.id,
    slug: input.slug,
    workspaceSlug: input.workspaceSlug,
    userId: ctx.session.user.id,
    allowedRoles: meta?.allowedTeamRoles ?? [],
  })

  if (!permission.canAccess) {
    throw new NoPermission()
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  })
})
