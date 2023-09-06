import StarterKit from "@tiptap/starter-kit"

import { type Editor, Extension, type Range } from "@tiptap/core"
import Suggestion from "@tiptap/suggestion"
import { ReactRenderer } from "@tiptap/react"
import tippy, { type Instance } from "tippy.js"
import {
  VARIABLE_COLOR,
  VariableNode,
} from "~/ui/RichText/components/VariableNode"
import { CommandList, Key } from "~/ui/RichText/components/CommandList"
import type {
  SuggestionKeyDownProps,
  SuggestionOptions,
} from "@tiptap/suggestion/src/suggestion"
import { CreateVariableNode } from "~/ui/RichText/components/CreateVariableNode"

type CommandProps = {
  editor: Editor
  range: Range
}

type Command = (props: CommandProps) => void

type CustomSuggestionOptions = SuggestionOptions<{ command: Command }>

interface Options {
  suggestion: Omit<CustomSuggestionOptions, "editor">
}

const Command = Extension.create<Options>({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({ editor, range, props }) => {
          props.command({ editor, range })
        },
      },
    }
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },
})

type SuggestionItem = { command: Command } & {
  title: string
}

const getSuggestionItems = (): SuggestionItem[] => {
  return [
    {
      title: "Create-Variable",
      command: ({ editor, range }) => {
        editor
          .chain()
          .deleteRange(range)
          .insertContent({
            type: "create-variable",
          })
          .run()
      },
    },
    {
      title: "Email",
      command: ({ editor, range }) => {
        editor
          .chain()
          .deleteRange(range)
          .insertContent({
            type: "variable",
            attrs: {
              text: "email",
              className: VARIABLE_COLOR["text"],
              type: "text",
            },
          })
          .run()
      },
    },
    {
      title: "Result",
      command: ({ editor, range }) => {
        editor
          .chain()
          .deleteRange(range)
          .insertContent({
            type: "variable",
            attrs: {
              text: "result",
              className: VARIABLE_COLOR["text"],
              type: "text",
            },
          })
          .run()
      },
    },
  ]
}

type RenderItem = Partial<
  ReturnType<NonNullable<CustomSuggestionOptions["render"]>>
>

const renderSuggestionItems = (): RenderItem => {
  let component: ReactRenderer<{
    onKeyDown: (event: SuggestionKeyDownProps) => boolean
  }> | null = null
  let popup: Instance[] | null = null

  return {
    onStart: (props) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      })

      popup = tippy("body", {
        getReferenceClientRect: props.clientRect as () => DOMRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      })
    },
    onKeyDown: (event) => {
      if (event.event.key === Key.Escape) {
        popup?.[0]?.hide()

        return true
      }

      return !!component?.ref?.onKeyDown(event)
    },
    onExit: () => {
      popup?.[0]?.destroy()
      component?.destroy()
    },
  }
}

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderSuggestionItems,
  },
})

export const TipTapExtensions = [
  StarterKit.configure({
    paragraph: {
      HTMLAttributes: {
        class: "leading-5",
      },
    },
  }),
  SlashCommand,
  VariableNode,
  CreateVariableNode,
]
