"use server"

import { createAction } from "~/server/api/trpc"
import { upsertFilter } from "~/server/api/routers/filter-setting/filter-setting.router"

export const upsertFilterAction = createAction(upsertFilter)
