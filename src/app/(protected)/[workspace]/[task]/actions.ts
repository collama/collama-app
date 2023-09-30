"use server"

import { upsertFilter } from "~/server/api/routers/filter-setting/filter-setting.router"
import * as taskRouter from "~/server/api/routers/task/task.router"
import { createAction } from "~/server/api/trpc"

export const removeMemberOnTaskAction = createAction(taskRouter.removeMember)

export const inviteMemberOnTaskAction = createAction(taskRouter.inviteMember)
