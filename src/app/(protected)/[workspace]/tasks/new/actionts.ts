"use server"

import { createAction } from "~/server/api/trpc"
import * as taskRouter from "~/server/api/routers/task/task.router"

export const createTaskAction = createAction(taskRouter.create)

export const executeTaskAction = createAction(taskRouter.execute)

export const inviteMemberToTaskAction = createAction(taskRouter.inviteMember)

export const deleteTaskAction = createAction(taskRouter.deleteById)

export const deleteMemberOnTaskAction = createAction(taskRouter.removeMember)
