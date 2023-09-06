import { type BaseSyntheticEvent, useState } from "react"
import { NodeViewWrapper } from "@tiptap/react"
import { type NodeViewProps } from "@tiptap/core"
import { Popover } from "~/ui/Popover"
import useZodForm from "~/common/form"
import { z } from "zod"
import { Controller } from "react-hook-form"
import { Input } from "~/ui/input"
import { Button } from "~/ui/Button"
import {
  VARIABLE_COLOR,
  type VariableType,
} from "~/ui/RichText/components/VariableNode"

export const CreateVariable = ({
  deleteNode,
  getPos,
  editor,
}: NodeViewProps) => {
  const [open, setOpen] = useState(true)

  const onSuccess = (data: SubmitData) => {
    const position = getPos()
    deleteNode()
    editor
      .chain()
      .insertContentAt(
        position,
        {
          type: "variable",
          attrs: {
            text: data.name,
            className: VARIABLE_COLOR[data.type as VariableType],
            type: data.type,
          },
        },
        {
          parseOptions: {
            preserveWhitespace: "full",
          },
        }
      )
      .insertContent({ type: "text", text: " " })
      .focus()
      .run()
    setOpen(false)
  }

  return (
    <NodeViewWrapper className="inline">
      <Popover
        open={open}
        onOpenChange={() => setOpen(!open)}
        content={<CreateVariableForm onSuccess={onSuccess} />}
      >
        <span>Show</span>
      </Popover>
    </NodeViewWrapper>
  )
}

const schema = z.object({
  name: z.string(),
  type: z.string(),
})
type SubmitData = z.infer<typeof schema>

const CreateVariableForm = ({
  onSuccess,
}: {
  onSuccess: (props: SubmitData) => void
}) => {
  const { handleSubmit, control } = useZodForm({
    schema,
    defaultValues: {
      name: "prompt-name",
      type: "text",
    },
  })

  const onSubmit = (data: SubmitData) => {
    onSuccess(data)
  }

  // Because have an issue https://github.com/react-hook-form/documentation/issues/916
  const preventBubbling = async (e: BaseSyntheticEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await handleSubmit(onSubmit)()
  }

  return (
    <div>
      <form onSubmit={preventBubbling}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => <Input {...field} />}
        />
        <Controller
          control={control}
          name="type"
          render={({ field }) => <Input {...field} />}
        />
        <Button htmlType="submit">Submit</Button>
      </form>
    </div>
  )
}
