import type { TaskRevision } from "@prisma/client"
import { type Session } from "next-auth"
import { type z } from "zod"
import { type TypeofTaskRevisionSlugAndVersionInput } from "~/server/api/middlewares/permission/task-revision-permission"
import { cryptoTr } from "~/server/api/providers/crypto-provider"
import type {
  UpdateMessageInput,
  AppendMessageInput,
  InsertMessageInput,
  RemoveMessageInput,
} from "~/server/api/routers/taskRevision/taskRevision.input"
import type { ExecuteInput } from "~/server/api/routers/taskRevision/taskRevision.input"
import { createProvider } from "~/server/api/services/llm/llm"
import {
  convertVariables,
  fillVariables,
  getContent,
  getTextFromTextContent,
  toChatCompletionMessages,
} from "~/server/api/services/prompt"
import { serializePrompt } from "~/server/api/services/task"
import type { ExtendedPrismaClient } from "~/server/db"
import { ApiKeyNotFound } from "~/server/errors/api-key.error"

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

export const executeMessage = async ({
  input,
  prisma,
  taskRevision,
}: TaskRevisionProcedureInput<z.infer<typeof ExecuteInput>>) => {
  const promptMessages = taskRevision.messages.map((item) => ({
    ...item,
    content: serializePrompt(item.content),
  }))

  const contentMessages = promptMessages.map((promptMessage) => ({
    ...promptMessage,
    content: getContent(promptMessage.content.content),
  }))

  const textMessages = contentMessages.map((contentMessage) => ({
    ...contentMessage,
    content: fillVariables(
      contentMessage.content,
      convertVariables(input.variables)
    ),
  }))

  const templateMessages = textMessages.map((textMessage) => ({
    ...textMessage,
    content: getTextFromTextContent(textMessage.content),
  }))

  const messages = [...templateMessages, ...input.messages]

  const apiKey = await prisma.apiKey.findFirst()
  if (!apiKey) {
    throw new ApiKeyNotFound()
  }

  const provider = createProvider("openai", {
    apiKey: cryptoTr.decrypt(apiKey.value),
    model: "gpt-3.5-turbo",
  })

  return provider.chatCompletion(toChatCompletionMessages(messages))
}
