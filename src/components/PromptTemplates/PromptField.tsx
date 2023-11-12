import { ChatRole } from "@prisma/client"
import { IconCircleMinus, IconPlus } from "@tabler/icons-react"
import { type JSONContent } from "@tiptap/react"
import { type FC, type MouseEvent } from "react"
import { Controller, useFormContext } from "react-hook-form"
import type { FieldArrayWithId } from "react-hook-form/dist/types/fieldArray"
import type { Prompt } from "~/common/types/prompt"
import { debounce } from "~/common/utils"
import type { RootTemplatesProps } from "~/components/PromptTemplates"
import { type UpdateTemplateMessage } from "~/components/PromptTemplates"
import {
  DEFAULT_TEMPLATE,
  PROMPT_FORM_NAME,
  type PromptsTemplate,
} from "~/components/PromptTemplates/contants"
import { serializePrompt } from "~/server/api/services/task"
import { Input } from "~/ui/Input"
import { RichText } from "~/ui/RichText"
import { Select } from "~/ui/Select"

type PromptFieldProps = {
  index: number
  isTemplate: boolean
  currentField: FieldArrayWithId<PromptsTemplate>
} & Omit<RootTemplatesProps, keyof UpdateTemplateMessage> &
  Partial<UpdateTemplateMessage>

const transformValue = (value: string | Prompt) => {
  return typeof value === "string" ? serializePrompt(value) : value
}

export const PromptField: FC<PromptFieldProps> = ({
  index,
  remove,
  insert,
  updateRole,
  updateContent,
  currentField,
  isTemplate,
}) => {
  const { control } = useFormContext<PromptsTemplate>()
  const onRemove = () => {
    remove(index)
  }

  const onInsert = (event: MouseEvent) => {
    event.preventDefault()
    insert(index, DEFAULT_TEMPLATE)
  }

  return (
    <div className="relative group/item odd:bg-white even:bg-gray-50">

      <div className='flex justify-between items-center px-4 lg:hidden'>
        <Controller
          control={control}
          name={`${PROMPT_FORM_NAME}.${index}.role`}
          render={({ field }) => (
            <Select
              {...field}
              size="sm"
              defaultValue={field.value as string}
              options={[
                { value: ChatRole.User },
                { value: ChatRole.System },
                { value: ChatRole.Assistant },
              ]}
              className="bg-neutral-100 group-focus:bg-indigo-300 uppercase font-medium"
              onChange={(v) => {
                updateRole?.(index, v as ChatRole, currentField)
                field.onChange(v)
              }}
            />
          )}
        />

        <span className="group-hover/item:visible invisible" onClick={onRemove}>
          <IconCircleMinus />
        </span>
      </div>

      <div className="flex items-center lg:space-x-8 p-4 border-b ">
        <span className='hidden lg:inline-block'>
          <Controller
            control={control}
            name={`${PROMPT_FORM_NAME}.${index}.role`}
            render={({ field }) => (
              <Select
                {...field}
                size="sm"
                defaultValue={field.value as string}
                options={[
                  { value: ChatRole.User },
                  { value: ChatRole.System },
                  { value: ChatRole.Assistant },
                ]}
                className="bg-neutral-100 group-focus:bg-indigo-300 uppercase font-medium"
                onChange={(v) => {
                  updateRole?.(index, v as ChatRole, currentField)
                  field.onChange(v)
                }}
              />
            )}
          />
        </span>
        {isTemplate ? (
          <Controller
            control={control}
            name={`${PROMPT_FORM_NAME}.${index}.content`}
            render={({ field }) => {
              return (
                <RichText
                  onChange={debounce((data: JSONContent) => {
                    const value = JSON.stringify(data)

                    field.onChange(value)
                    updateContent?.(index, value, currentField)
                  }, 1000)}
                  value={transformValue(field.value)}
                  placeholder="something ..."
                />
              )
            }}
          />
        ) : (
          <Controller
            control={control}
            name={`${PROMPT_FORM_NAME}.${index}.content`}
            render={({ field }) => {
              return (
                <Input.TextArea
                  {...field}
                  placeholder="something ..."
                  autoSize
                />
              )
            }}
          />
        )}
        <span className="hidden lg:inline-block group-hover/item:visible invisible" onClick={onRemove}>
          <IconCircleMinus />
        </span>
      </div>

      <div className="group/insert absolute -bottom-3 z-[1] h-6 w-full text-center">
        <button
          onClick={onInsert}
          className="bg-white opacity-0 transition-opacity group-hover/insert:opacity-100 inline-flex justify-center items-center relative select-none rounded w-6 h-6 focus:outline-none focus:ring-1  focus:ring-gray-200 border border-gray-400 hover:border-gray-400 active:border-gray-500 text-black hover:bg-gray-100 active:bg-gray-200"
        >
          <IconPlus />
        </button>
      </div>
    </div>
  )
}
