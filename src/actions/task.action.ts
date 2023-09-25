"use server"

import { createAction } from "~/server/api/trpc"
import { upsertFilter } from "~/server/api/routers/filter-setting/filter-setting.router"
import * as taskRouter from "~/server/api/routers/task/task.router"

export const upsertFilterAction = createAction(upsertFilter)

export const deleteTaskBySlugAction = createAction(taskRouter.deleteBySlug)

export const removeMemberOnTaskAction = createAction(taskRouter.removeMember)

export const inviteMemberOnTaskAction = createAction(taskRouter.inviteMember)
