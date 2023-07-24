import type { EditorProps } from "@tiptap/pm/view"
import { Key } from "./CommandList"

export const TipTapProps: EditorProps = {
  attributes: {
    class: `focus:outline-none max-w-full`,
  },
  handleDOMEvents: {
    keydown: (_view, event): boolean => {
      // prevent default event listeners from firing when slash command is active
      const keySet = new Set([Key.ArrowUp, Key.ArrowDown, Key.Enter])
      if (keySet.has(event.key as Key)) {
        return !!document.querySelector("#slash-command")
      }

      return false
    },
  },
}
