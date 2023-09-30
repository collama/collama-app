"use server"

import { upsertFilter } from "~/server/api/routers/filter-setting/filter-setting.router"
import { deleteTaskById } from "~/server/api/routers/task/task.router"
import { createAction } from "~/server/api/trpc"

export const upsertFilterAction = createAction(upsertFilter)

export const deleteTaskByIdAction = createAction(deleteTaskById)
