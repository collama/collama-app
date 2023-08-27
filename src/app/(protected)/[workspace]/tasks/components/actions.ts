"use server"

import { createAction } from "~/server/api/trpc"
import { upsertFilter } from "~/server/api/routers/filter-setting"

export const upsertFilterAction = createAction(upsertFilter)
