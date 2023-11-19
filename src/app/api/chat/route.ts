import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"
import { type z } from "zod"
import { cryptoTr } from "~/server/api/providers/crypto-provider"
import { type ExecuteInput } from "~/server/api/routers/taskRevision/taskRevision.input"
import {
  convertVariables,
  fillVariables,
  getContent,
  getTextFromTextContent,
  type PureMessage,
  toChatCompletionMessages,
} from "~/server/api/services/prompt"
import { serializePrompt } from "~/server/api/services/task"
import { prisma } from "~/server/db"
import { ApiKeyNotFound } from "~/server/errors/api-key.error"

type Json = Omit<z.infer<typeof ExecuteInput>, "messages"> & {
  messages: PureMessage[]
}

export async function POST(req: Request) {
  const {
    messages: inputMessages,
    taskRevisionId,
    variables: inputVariables,
  } = (await req.json()) as Json

  const taskRevision = await prisma.taskRevision.findUnique({
    where: {
      id: taskRevisionId,
    },
  })

  if (!taskRevision) throw new Error("Task or version invalid")

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
      convertVariables(inputVariables)
    ),
  }))

  const templateMessages = textMessages.map((textMessage) => ({
    ...textMessage,
    content: getTextFromTextContent(textMessage.content),
  }))

  const messages = [
    ...toChatCompletionMessages(templateMessages),
    ...inputMessages,
  ]

// TODO:refactor later, by pass permission
  const apiKey = await prisma.apiKey.findFirst()

  if (!apiKey) {
    throw new ApiKeyNotFound()
  }

  const openai = new OpenAI({
    apiKey: cryptoTr.decrypt(apiKey.value),
  })

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    stream: true,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)

  // Respond with the stream
  return new StreamingTextResponse(stream)
}
