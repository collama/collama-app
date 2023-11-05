import { type ChatRole, type Message } from "@prisma/client"
import type { ChatCompletionRole } from "openai/src/resources/chat/completions"
import type {
  Content,
  Prompt,
  TextContent,
  VariableContent,
} from "~/common/types/prompt"
import { type Paragraph, type ParagraphRequired } from "~/common/types/prompt"
import type { Variable } from "~/components/VariablesSection/contants"

export const getTextFromTextContent = (contents: TextContent[]): string => {
  return contents.reduce((res, cur) => {
    return `${res} ${cur.text}`
  }, "")
}

const checkParagraphRequired = (
  paragraph: Paragraph
): paragraph is ParagraphRequired => {
  return !!paragraph.content
}

export const getContent = (arr: Prompt["content"]): Content[] =>
  arr.filter(checkParagraphRequired).flatMap((paraNode) => paraNode.content)

export const fillVariables = (
  contents: Content[],
  variables: Record<string, string>
): TextContent[] => {
  return contents.map((content) => {
    if (content.type === "variable") {
      const text = variables[content.attrs.text] as string

      return {
        type: "text",
        text: text,
      }
    }

    return content
  })
}

const checkIsVariables = (content: Content): content is VariableContent =>
  content.type === "variable"

const removeDuplicateVariable = (
  res: VariableContent[],
  cur: VariableContent
) => {
  if (!res.some((item) => item.attrs.text === cur.attrs.text)) {
    res.push(cur)
  }
  return res
}

export const getVariableContents = (
  arr: Prompt["content"]
): VariableContent[] =>
  getContent(arr).filter(checkIsVariables).reduce(removeDuplicateVariable, [])

export const convertVariables = (
  variables: Variable[]
): Record<string, string> =>
  variables.reduce<Record<string, string>>((res, { name, value }) => {
    res[name] = value

    return res
  }, {})

export type PureMessage = Omit<Message, "id" | "role"> & {
  role: ChatCompletionRole
}

export const toChatCompletionMessages = (messages: Message[]): PureMessage[] =>
  messages.map((message) => toChatCompletionMessage(message))

export const toChatCompletionMessage = (messages: Message): PureMessage => {
  // remove id in messages
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = messages

  return { ...rest, role: ROLE[rest.role] ?? "user" }
}

const ROLE: Record<ChatRole, ChatCompletionRole> = {
  System: "system",
  Assistant: "assistant",
  User: "user",
  Tool: "function",
}
