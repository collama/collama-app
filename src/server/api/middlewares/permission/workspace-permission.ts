import { experimental_standaloneMiddleware, TRPCError } from "@trpc/server"
import { z } from "zod"
import { zSlug } from "~/common/validation"
import type { Context, Meta } from "~/server/api/trpc"
import { NoPermission } from "~/server/errors/task.error"

export const WorkspaceSlugInput = z.object({
  slug: zSlug,
})

export type WorkspaceSlugInput = z.infer<typeof WorkspaceSlugInput>

export const WorkspaceIdInput = z.object({
  id: z.string(),
})

export type WorkspaceIdInput = z.infer<typeof WorkspaceIdInput>

export const canAccessWorkspaceMiddleware = experimental_standaloneMiddleware<{
  ctx: Context // defaults to 'object' if not defined
  input: {
    id?: string
    slug?: string
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

  const permission = await ctx.prisma.workspace.canUserAccess({
    id: input.id,
    slug: input.slug,
    userId: ctx.session.user.id,
    allowedRoles: meta?.allowedRoles ?? [],
  })

  if (!permission.canAccess) {
    throw new NoPermission()
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      workspace: permission.workspace,
    },
  })
})
