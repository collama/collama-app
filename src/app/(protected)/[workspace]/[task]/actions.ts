"use server"

import * as taskRouter from "~/server/api/routers/task/task.router"
import * as taskRevision from "~/server/api/routers/taskRevision/taskRevision.router"
import { createAction } from "~/server/api/trpc"

export const removeMemberOnTaskAction = createAction(taskRouter.removeMember)

export const inviteMemberOnTaskAction = createAction(taskRouter.inviteMember)

export const appendMessageOnTaskRevision = createAction(taskRevision.appendMessage)
export const insertMessageOnTaskRevision = createAction(taskRevision.insertMessage)
export const updateMessageOnTaskRevision = createAction(taskRevision.updateMessage)
export const removeMessageOnTaskRevision = createAction(taskRevision.removeMessage)
