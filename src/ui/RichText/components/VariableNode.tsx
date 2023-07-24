import { mergeAttributes, Node, type NodeViewProps } from "@tiptap/core"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { IconPawFilled } from "@tabler/icons-react"

const Variable = (props: NodeViewProps) => {
  return (
    <NodeViewWrapper className="inline">
      <button className="px-1 border bg-gray-100 inline-block rounded leading-4">
        <span className="inline-block pr-1 relative w-4 h-3">
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
