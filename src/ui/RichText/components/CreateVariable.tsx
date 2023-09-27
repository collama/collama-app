import { IconPawFilled } from "@tabler/icons-react"
import { type NodeViewProps } from "@tiptap/core"
import { NodeViewWrapper } from "@tiptap/react"
import { type BaseSyntheticEvent, useState } from "react"
import { Controller } from "react-hook-form"
import { z } from "zod"
import useZodForm from "~/common/form"
import { Button } from "~/ui/Button"
import { Input } from "~/ui/Input"
import { Popover } from "~/ui/Popover"
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
        placement="bottom-end"
        onOpenChange={() => setOpen(!open)}
        content={<CreateVariableForm onSuccess={onSuccess} />}
      >
        <span className="relative inline-block h-3 w-4 pr-1">
          <span className="absolute left-0 inline-flex items-center text-center text-indigo-700">
            <IconPawFilled size={14} />
          </span>
        </span>
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
          render={({ field }) => (
            <Input {...field} placeholder="Type your variable name" />
          )}
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
