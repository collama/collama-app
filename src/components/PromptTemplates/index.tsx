import type { ChatRole as ChatRoleType, Message } from "@prisma/client"
import { ChatRole } from "@prisma/client"
import { type FC, useEffect, useRef } from "react"
import { FormProvider, useFieldArray } from "react-hook-form"
import useZodForm from "~/common/form"
import { PromptField } from "~/components/PromptTemplates/PromptField"
import {
  DEFAULT_TEMPLATE,
  PROMPT_FORM_NAME,
  promptSchema,
  type PromptsTemplate,
} from "~/components/PromptTemplates/contants"
import { Button } from "~/ui/Button"

export type UpdateTemplateMessage = {
  updateRole: (index: number, value: ChatRoleType, message: Message) => void
  updateContent: (index: number, value: string, message: Message) => void
}
export type RootTemplatesProps = {
  remove: (index: number) => void
  insert: (index: number, value: Message) => void
} & UpdateTemplateMessage

type Control = {
  data: Message[]
  append: (value: Message) => void
} & RootTemplatesProps

type Submit = {
  data: undefined
  submit: (data: Message[]) => void
}

type PromptTemplatesProps = Control | Submit

export const PromptTemplates: FC<PromptTemplatesProps> = (props) => {
  const controlProps = useRef<Control | null>(null)
  const submitProps = useRef<Submit | null>(null)

  useEffect(() => {
    !props.data ? (submitProps.current = props) : (controlProps.current = props)
  }, [props.data])

  const methods = useZodForm({
    schema: promptSchema,
    defaultValues: {
      prompts: props.data,
    },
  })

  const {
    fields,
    insert: fieldInsert,
    append: fieldAppend,
    remove: fieldRemove,
  } = useFieldArray({
    control: methods.control,
    name: PROMPT_FORM_NAME,
  })

  useEffect(() => {
    if (
      controlProps.current &&
      (!props.data || (props.data && props.data.length <= 0))
    ) {
      fieldAppend({ ...DEFAULT_TEMPLATE, role: ChatRole.System })
      controlProps.current?.append({
        ...DEFAULT_TEMPLATE,
        role: ChatRole.System,
      })
    }

    if (submitProps.current) {
      fieldAppend({ ...DEFAULT_TEMPLATE, content: "" })
    }
  }, [])

  const onAppend = () => {
    submitProps.current
      ? fieldAppend({ ...DEFAULT_TEMPLATE, content: "" })
      : fieldAppend(DEFAULT_TEMPLATE)

    controlProps.current?.append(DEFAULT_TEMPLATE)
  }

  const onInsert = (index: number, value: Message) => {
    fieldInsert(index + 1, value)

    controlProps.current?.insert(index, value)
  }

  const onRemove = (index: number) => {
    fieldRemove(index)

    controlProps.current?.remove(index)
  }

  const onSubmit = (data: PromptsTemplate) => {
    submitProps.current?.submit(data.prompts)
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ul>
            {fields.map((field, index) => (
              <PromptField
                key={field.id}
                field={field}
                index={index}
                remove={onRemove}
                insert={onInsert}
                updateRole={controlProps.current?.updateRole}
                updateContent={controlProps.current?.updateContent}
                isTemplate={!submitProps.current}
              />
            ))}
          </ul>

          <section className="py-2">
            <Button
              size="sm"
              className="text-gray-400 rounded-lg"
              onClick={onAppend}
            >
              new template
            </Button>
            {submitProps.current && (
              <Button
                size="sm"
                className="text-gray-400 rounded-lg"
                htmlType="submit"
              >
                run
              </Button>
            )}
          </section>
        </form>
      </FormProvider>
    </div>
  )
}
