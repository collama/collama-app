import {z} from "zod";
import {zSlug, zVersion} from "~/common/validation";
import {experimental_standaloneMiddleware} from "@trpc/server";
import {Context, Meta} from "~/server/api/trpc";


export const TaskRevisionSlugAndVersionInput = z.object({
  slug: zSlug,
  version: zVersion
})

export type TypeofTaskRevisionSlugAndVersionInput = z.infer<typeof TaskRevisionSlugAndVersionInput>

export const canAccessTaskRevisionMiddleware = experimental_standaloneMiddleware<{
  ctx: Context // defaults to 'object' if not defined
  input: {
    taskSlug: string
  } // defaults to 'unknown' if not defined
  meta: Meta // not defined here, defaults to 'object | undefined'
}>().create(async ({ ctx, next, input, meta })
