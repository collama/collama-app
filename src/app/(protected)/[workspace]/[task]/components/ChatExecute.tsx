"use client"

import { ChatRole, type Message } from "@prisma/client"
import { useChat } from "ai/react"
import { type FC, useEffect, useRef } from "react"
import { v4 } from "uuid"
import type { TaskRevisionProps } from "~/app/(protected)/[workspace]/[task]/page"
import { PromptTemplates, type TemplateRef } from "~/components/PromptTemplates"
import { toChatCompletionMessage } from "~/server/api/services/prompt"
import { useTaskStoreVariables } from "~/store/taskStore"

export const ChatExecute: FC<TaskRevisionProps> = ({ taskRevision }) => {
  const appendRef = useRef<TemplateRef>(null)
  const variables = useTaskStoreVariables()
  const { messages, isLoading, append, stop } = useChat({
    api: "/api/chat",
    body: {
      taskRevisionId: taskRevision.id,
      variables,
    },
  })

  const onSubmit = async (messages: Message[]) => {
    const lastMessage = messages.pop()
    if (!lastMessage) return

    appendRef?.current?.appendField({
      role: ChatRole.Assistant,
      id: v4(),
      content: "",
    })

    await append(toChatCompletionMessage(lastMessage))
  }

  useEffect(() => {
    if (messages.length > 0 && isLoading) {
      const lastIndex = messages.length - 1

      if (messages[lastIndex]!.role === "user") return

      appendRef?.current?.updateField(lastIndex, {
        role: ChatRole.Assistant,
        content: messages[lastIndex]!.content,
        id: messages[lastIndex]!.id,
      })
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      appendRef?.current?.appendField({
        role: ChatRole.User,
        id: v4(),
        content: "",
      })
    }
  }, [messages, isLoading])

  return (
    <div>
      <PromptTemplates
        data={undefined}
        submit={onSubmit}
        ref={appendRef}
        isLoading={isLoading}
        stop={stop}
      />
    </div>
  )
}
