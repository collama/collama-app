import OpenAI from "openai"
import { env } from "~/env.mjs"
import type {
  Content,
  Prompt,
  TextContent,
  VariableContent,
} from "~/common/types/prompt"
import { type Paragraph, type ParagraphRequired } from "~/common/types/prompt"
import "@total-typescript/ts-reset"
import type { Prisma, PrismaClient } from "@prisma/client"
import type { DefaultArgs } from "@prisma/client/runtime/library"

const openai = new OpenAI({
  apiKey: env.OPENAI_KEY, // defaults to process.env["OPENAI_API_KEY"]
})

export async function callOpenAI(content: string) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: content }],
    model: "gpt-3.5-turbo",
  })

  return completion.choices
}

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

export const getVariableContents = (
  arr: Prompt["content"]
): VariableContent[] => getContent(arr).filter(checkIsVariables)

export const getPromptFromTask = async (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  name: string
): Promise<Prompt> => {
  const task = await prisma.task.findUnique({
    where: {
      name,
    },
    select: {
      prompt: true,
    },
  })

  return JSON.parse(task ? (task.prompt as string) : "") as Prompt
}
