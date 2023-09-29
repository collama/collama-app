import type { Editor } from "@tiptap/core"
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react"
import { useCallback, useEffect } from "react"
import { TipTapExtensions } from "~/ui/RichText/components/TipTapExtension"
import { TipTapProps } from "~/ui/RichText/components/TipTapProps"

export function TipTap({
  onChange,
}: {
  onChange: (editor: JSONContent) => void
}) {
  const editor = useEditor({
    extensions: TipTapExtensions,
    editorProps: TipTapProps,
    // content: `<p>
    //   new 1
    //
    // <variable-node text="new-1"></variable-node></p>`,
  })

  const onEditorChange = useCallback(
    ({ editor }: { editor: Editor }) => {
      onChange(editor.getJSON())
    },
    [onChange]
  )

  useEffect(() => {
    if (editor) {
      editor.on("update", onEditorChange)

      return () => {
        editor.off("update", onEditorChange)
      }
    }

    return () => null
  }, [onEditorChange, editor])

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run()
      }}
      className="w-full min-h-[200px]"
    >
      <EditorContent editor={editor} />
    </div>
  )
}
