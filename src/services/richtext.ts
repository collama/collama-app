import type { Message } from "@prisma/client"
import type { VariableContent } from "~/common/types/prompt"
import { type Variable } from "~/components/VariablesSection/contants"
import { getVariableContents } from "~/server/api/services/prompt"
import { serializePrompt } from "~/server/api/services/task"
import { type Snapshot } from "~/store/task"

const getContents = (messages: readonly Snapshot<Message>[]): string[] => {
  return messages.map((message) => message.content)
}

const getVariablesContent = (contents: string[]): VariableContent[] => {
  const prompts = contents.map((content) => serializePrompt(content))

  return prompts.flatMap((prompt) => getVariableContents(prompt.content))
}

const getVariables = (variableContents: VariableContent[]): Variable[] => {
  return variableContents.map((content) => ({
    name: content.attrs.text,
    value: "",
  }))
}

export const transformTemplates2Variables = (
  templates: readonly Snapshot<Message>[]
): Variable[] => {
  const contents = getContents(templates)
  const variableContents = getVariablesContent(contents)

  return getVariables(variableContents)
}
