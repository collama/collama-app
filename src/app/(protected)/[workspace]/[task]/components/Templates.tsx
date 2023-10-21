"use client"

import { type ChatRole, type Message } from "@prisma/client"
import { type FC } from "react"
import {
  updateMessageOnTaskRevision,
  removeMessageOnTaskRevision,
  insertMessageOnTaskRevision,
  appendMessageOnTaskRevision,
} from "~/app/(protected)/[workspace]/[task]/actions"
import { type TaskRevisionProps } from "~/app/(protected)/[workspace]/[task]/page"
import { PromptTemplates } from "~/components/PromptTemplates"
import { useTaskStoreTemplatesActions } from "~/store/task"
import { useAction } from "~/trpc/client"

export const Templates: FC<TaskRevisionProps> = ({ taskRevision }) => {
  const { append, insert, updateContent, updateRole, remove } =
    useTaskStoreTemplatesActions()

  const { mutate: updateMessage } = useAction(updateMessageOnTaskRevision)
  const { mutate: insertMessage } = useAction(insertMessageOnTaskRevision)
  const { mutate: appendMessage } = useAction(appendMessageOnTaskRevision)
  const { mutate: removeMessage } = useAction(removeMessageOnTaskRevision)
  const onAppend = (value: Message) => {
    append(value)
    appendMessage({
      message: value,
      id: taskRevision.taskId,
      version: taskRevision.version,
    })
  }

  const onInsert = (index: number, value: Message) => {
    insert(index, value)
    insertMessage({
      message: value,
      index,
      id: taskRevision.taskId,
      version: taskRevision.version,
    })
  }

  const onRemove = (index: number) => {
    remove(index)
    removeMessage({
      index,
      id: taskRevision.taskId,
      version: taskRevision.version,
    })
  }
  const onUpdateContent = (index: number, value: string, record: Message) => {
    const message = { ...record, content: value }

    updateContent(index, value)
    updateMessage({
      message,
      index,
      id: taskRevision.taskId,
      version: taskRevision.version,
    })
  }

  const onUpdateRole = (index: number, value: ChatRole, record: Message) => {
    const message = { ...record, role: value }
    updateRole(index, value)
    updateMessage({
      message,
      index,
      id: taskRevision.taskId,
      version: taskRevision.version,
    })
  }

  return (
    <PromptTemplates
      data={taskRevision.messages}
      append={onAppend}
      remove={onRemove}
      insert={onInsert}
      updateContent={onUpdateContent}
      updateRole={onUpdateRole}
    />
  )
}
