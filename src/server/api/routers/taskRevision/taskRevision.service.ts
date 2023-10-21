import type { TaskRevision } from "@prisma/client"
import { type Session } from "next-auth"
import { type z } from "zod"
import { type TypeofTaskRevisionSlugAndVersionInput } from "~/server/api/middlewares/permission/task-revision-permission"
import type {
  UpdateMessageInput,
  AppendMessageInput,
  InsertMessageInput,
  RemoveMessageInput,
} from "~/server/api/routers/taskRevision/taskRevision.input"
import type { ExtendedPrismaClient } from "~/server/db"

export interface TaskRevisionProcedureInput<T = unknown> {
  prisma: ExtendedPrismaClient
  input: T
  session: Session
  taskRevision: TaskRevision
}

export const getByIdAndVersion = ({
  taskRevision,
}: TaskRevisionProcedureInput<TypeofTaskRevisionSlugAndVersionInput>) => {
  return taskRevision
}

export const appendMessage = ({
  prisma,
  input,
  taskRevision,
}: TaskRevisionProcedureInput<z.infer<typeof AppendMessageInput>>) => {
  return prisma.taskRevision.update({
    where: {
      id: taskRevision.id,
    },
    data: {
      messages: {
        push: input.message,
      },
    },
  })
}

export const insertMessage = ({
  prisma,
  input,
  taskRevision,
}: TaskRevisionProcedureInput<z.infer<typeof InsertMessageInput>>) => {
  const values = taskRevision.messages
  values.splice(input.index, 0, input.message)

  return prisma.taskRevision.update({
    where: {
      id: taskRevision.id,
    },
    data: {
      messages: { set: values },
    },
  })
}

export const updateMessage = ({
  prisma,
  input,
  taskRevision,
}: TaskRevisionProcedureInput<z.infer<typeof UpdateMessageInput>>) => {
  const values = taskRevision.messages
  values[input.index] = input.message

  return prisma.taskRevision.update({
    where: {
      id: taskRevision.id,
    },
    data: {
      messages: { set: values },
    },
  })
}

export const removeMessage = ({
  prisma,
  input,
  taskRevision,
}: TaskRevisionProcedureInput<z.infer<typeof RemoveMessageInput>>) => {
  const values = taskRevision.messages
  values.splice(input.index, 1)

  return prisma.taskRevision.update({
    where: {
      id: taskRevision.id,
    },
    data: {
      messages: { set: values },
    },
  })
}
