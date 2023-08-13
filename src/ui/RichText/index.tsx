import { useEditor, EditorContent } from "@tiptap/react"
import { TipTapProps } from "~/ui/RichText/components/TipTapProps"
import { TipTapExtensions } from "~/ui/RichText/components/TipTapExtension"
import type { Editor } from "@tiptap/core"
import { useEffect } from "react"

export function TipTap({
  setPrompt,
}: {
  setPrompt: (editor: Editor | null) => void
}) {
  const editor = useEditor({
    extensions: TipTapExtensions,
    editorProps: TipTapProps,
    // content: `<p>
    //   new 1
    //
    // <variable-node text="new-1"></variable-node></p>`,
  })

  useEffect(() => {
    setPrompt(editor)
  }, [editor, setPrompt])

  return (
    <div
      onClick={() => {
        editor?.chain().focus().run()
      }}
      className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white p-12 px-8 sm:rounded-lg sm:border sm:px-12 sm:shadow-lg"
    >
      <EditorContent editor={editor} />
    </div>
  )
}
