import { experimental_standaloneMiddleware, TRPCError } from "@trpc/server"
import { z } from "zod"
import {zId, zSlug, zVersion} from "~/common/validation"
import type { Context, Meta } from "~/server/api/trpc"
import { NoPermission } from "~/server/errors/general.error"
import { TaskRevisionNotFound } from "~/server/errors/task-revision.error"


export const TaskRevisionSlugAndVersionInput = z.object({
  id: zId.optional(),
  workspaceSlug: zSlug.optional(),
  taskSlug: zSlug.optional(),
  version: zVersion,
})

export type TypeofTaskRevisionSlugAndVersionInput = z.infer<
  typeof TaskRevisionSlugAndVersionInput
>

export const canAccessTaskRevisionMiddleware =
  experimental_standaloneMiddleware<{
    ctx: Context // defaults to 'object' if not defined
    input: TypeofTaskRevisionSlugAndVersionInput // defaults to 'unknown' if not defined
    meta: Meta // not defined here, defaults to 'object | undefined'
  }>().create(async ({ ctx, next, input, meta }) => {
    if (!ctx.session) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "session not found",
        cause: "",
      })
    }

    const permission = await ctx.prisma.task.canUserAccess({
      id: input.id,
      workspaceSlug: input.workspaceSlug,
      slug: input.taskSlug,
      userId: ctx.session.user.id,
      allowedRoles: meta?.allowedRoles ?? [],
    })

    if (!permission.canAccess) {
      throw new NoPermission()
    }

    const taskRevision = await ctx.prisma.taskRevision.findFirst({
      where: {
        taskId: permission.task.id,
        version: input.version,
      },
    })

    if (!taskRevision) throw new TaskRevisionNotFound()

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        taskRevision,
      },
    })
  })
