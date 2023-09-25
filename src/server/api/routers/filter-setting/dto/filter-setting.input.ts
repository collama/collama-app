import { z } from "zod"
import { zSlug } from "~/common/validation"

export const UpsertFilterInput = z.object({
  workspaceSlug: zSlug,
  setting: z.string(),
})

export const GetFilterSettingByWorkspaceSlugInput = z.object({ workspaceSlug: zSlug })
