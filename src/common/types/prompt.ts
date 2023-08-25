export type Prompt = {
  type: "doc"
  content: Paragraph[]
}

export type Paragraph = {
  type: "paragraph"
  content?: Content[]
}

export type ParagraphRequired = Required<Paragraph>

export type TextContent = {
  type: "text"
  text: string
}

export type VariableContent = {
  type: "variable"
  attrs: {
    text: string
    className: string
  }
}

export type Content = TextContent | VariableContent
