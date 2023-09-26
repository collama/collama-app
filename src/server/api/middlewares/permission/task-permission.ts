import { experimental_standaloneMiddleware, TRPCError } from "@trpc/server"
import type { Context, Meta } from "~/server/api/trpc"
import { NoPermissionToInviteMembers } from "~/server/errors/task.error"
import { z } from "zod"
import { zSlug } from "~/common/validation"

export const TaskSlugInput = z.object({
  slug: zSlug,
  workspaceSlug: zSlug,
})

export type TaskSlugInput = z.infer<typeof TaskSlugInput>

export const TaskIdInput = z.object({
  id: z.string(),
})

export type TaskIdInput = z.infer<typeof TaskIdInput>

export const canAccessTaskMiddleware = experimental_standaloneMiddleware<{
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

  let permission
  if (input.id) {
    permission = await ctx.prisma.task.canUserAccess({
      id: input.id,
      userId: ctx.session.user.id,
      allowedRoles: meta?.allowedRoles ?? [],
    })
  } else {
    permission = await ctx.prisma.task.canUserAccess({
      slug: input.slug,
      workspaceSlug: input.workspaceSlug,
      userId: ctx.session.user.id,
      allowedRoles: meta?.allowedRoles ?? [],
    })
  }

  if (!permission.canAccess) {
    throw new NoPermissionToInviteMembers()
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      task: permission.task,
    },
  })
})
