import type {
  Content,
  Prompt,
  TextContent,
  VariableContent,
} from "~/common/types/prompt"
import { type Paragraph, type ParagraphRequired } from "~/common/types/prompt"

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
