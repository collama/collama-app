"use server"

import * as taskRouter from "~/server/api/routers/task/task.router"
import { createAction } from "~/server/api/trpc"

export const createTaskAction = createAction(taskRouter.create)

export const executeTaskAction = createAction(taskRouter.execute)

export const inviteMemberToTaskAction = createAction(taskRouter.inviteMember)

export const deleteTaskBySlugAction = createAction(taskRouter.deleteBySlug)

export const deleteMemberOnTaskAction = createAction(taskRouter.removeMember)
