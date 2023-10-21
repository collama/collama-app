import type { Message, ChatRole as ChatRoleType } from "@prisma/client"
import { ChatRole } from "@prisma/client"
import { type FC, useEffect } from "react"
import { FormProvider, useFieldArray } from "react-hook-form"
import useZodForm from "~/common/form"
import { PromptField } from "~/components/PromptTemplates/PromptField"
import {
  DEFAULT_TEMPLATE,
  PROMPT_FORM_NAME,
  promptSchema,
} from "~/components/PromptTemplates/contants"
import { Button } from "~/ui/Button"

export interface RootTemplatesProps {
  remove: (index: number) => void
  insert: (index: number, value: Message) => void
  updateRole: (index: number, value: ChatRoleType, message: Message) => void
  updateContent: (index: number, value: string, message: Message) => void
}

interface PromptTemplatesProps extends RootTemplatesProps {
  append: (value: Message) => void
  data: Message[]
}

export const PromptTemplates: FC<PromptTemplatesProps> = ({
  data,
  updateContent,
  updateRole,
  remove,
  insert,
  append,
}) => {
  const methods = useZodForm({
    schema: promptSchema,
    defaultValues: {
      prompts: data,
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
    if (!data || data.length <= 0) {
      fieldAppend({ ...DEFAULT_TEMPLATE, role: ChatRole.System })
      append({ ...DEFAULT_TEMPLATE, role: ChatRole.System })
    }
  }, [])

  const onAppend = () => {
    fieldAppend(DEFAULT_TEMPLATE)
    append(DEFAULT_TEMPLATE)
  }

  const onInsert = (index: number, value: Message) => {
    fieldInsert(index + 1, value)
    insert(index, value)
  }

  const onRemove = (index: number) => {
    fieldRemove(index)
    remove(index)
  }

  return (
    <div>
      <FormProvider {...methods}>
        <form>
          <ul>
            {fields.map((field, index) => (
              <PromptField
                key={field.id}
                index={index}
                remove={onRemove}
                insert={onInsert}
                updateRole={updateRole}
                updateContent={updateContent}
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
            <Button
              size="sm"
              className="text-gray-400 rounded-lg"
              htmlType="submit"
            >
              save
            </Button>
          </section>
        </form>
      </FormProvider>
    </div>
  )
}
