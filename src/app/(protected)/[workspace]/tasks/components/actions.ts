"use server"

import { createAction } from "~/server/api/trpc"
import { upsertFilter } from "~/server/api/routers/filterSetting"

export const upsertFilterAction = createAction(upsertFilter)
