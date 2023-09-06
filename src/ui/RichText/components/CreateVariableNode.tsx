import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import { CreateVariable } from "~/ui/RichText/components/CreateVariable"

export const CreateVariableNode = Node.create({
  name: "create-variable",
  group: "inline",
  inline: true,
  atom: true,
  parseHTML() {
    return [
      {
        tag: "create-variable",
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ["create-variable", mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return ReactNodeViewRenderer(CreateVariable)
  },
})
