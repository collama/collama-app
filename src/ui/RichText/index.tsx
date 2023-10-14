import "./index.css"
import type { Editor } from "@tiptap/core"
import { Placeholder } from "@tiptap/extension-placeholder"
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react"
import { type FC } from "react"
import { TipTapExtensions } from "~/ui/RichText/components/TipTapExtension"
import { TipTapProps } from "~/ui/RichText/components/TipTapProps"

interface TipTapProps {
  onChange: (editor: JSONContent) => void
  value: string
  placeholder?: string
}

export const RichText: FC<TipTapProps> = ({ onChange, value, placeholder }) => {
  const editor = useEditor({
    extensions: [
      ...TipTapExtensions,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "my-custom-is-empty-class",
      }),
    ],
    editorProps: TipTapProps,
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getJSON())
    },
    content: value,

    // content: `<p>
    //   new 1
    //
    // <variable-node text="new-1"></variable-node></p>`,
  })

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run()
      }}
      className="w-full pe-6"
    >
      <EditorContent editor={editor} />
    </div>
  )
}
