import { mergeAttributes, Node, type NodeViewProps } from "@tiptap/core"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { IconPawFilled } from "@tabler/icons-react"
import { nanoid } from "nanoid"

export type VariableType = "text" | "number"

type VariableColor = Record<VariableType, string>

export const VARIABLE_COLOR: VariableColor = {
  text: "text-indigo-700",
  number: "text-blue-700"
}

const Variable = (props: NodeViewProps) => {
  return (
    <NodeViewWrapper className="inline">
      <button
        type="button"
        className="inline-block rounded border bg-gray-100 px-1 leading-4"
      >
        <span className="relative inline-block h-3 w-4 pr-1">
          <span className="absolute left-0 inline-flex items-center text-center">
            <IconPawFilled
              size={14}
              className={props.node.attrs.className as string}
            />
          </span>
        </span>
        <span>{props.node.attrs.text}</span>
      </button>
    </NodeViewWrapper>
  )
}

export const VariableNode = Node.create({
  name: "variable",
  group: "inline",
  inline: true,
  atom: true,
  addAttributes() {
    return {
      text: {
        default: null,
      },
      className: {
        default: null,
      },
      blockId: {
        default: nanoid(),
      },
      type: {
        default: null,
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: "variable-node",
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ["variable-node", mergeAttributes(HTMLAttributes)]
  },
  addNodeView() {
    return ReactNodeViewRenderer(Variable)
  },
})
