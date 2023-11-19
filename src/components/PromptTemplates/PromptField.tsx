import { ChatRole } from "@prisma/client"
import { IconCircleMinus, IconPlus } from "@tabler/icons-react"
import { type JSONContent } from "@tiptap/react"
import ResizeObserver from "rc-resize-observer"
import { type FC, type MouseEvent, useCallback, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import type { FieldArrayWithId } from "react-hook-form/dist/types/fieldArray"
import type { Prompt } from "~/common/types/prompt"
import { cl, debounce } from "~/common/utils"
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
  listWidth: number
} & Omit<RootTemplatesProps, keyof UpdateTemplateMessage> &
  Partial<UpdateTemplateMessage>

const transformValue = (value: string | Prompt) => {
  return typeof value === "string" ? serializePrompt(value) : value
}

const RESPONSIVE_WIDTH = 500

export const PromptField: FC<PromptFieldProps> = ({
  index,
  remove,
  insert,
  updateRole,
  updateContent,
  currentField,
  isTemplate,
  listWidth,
}) => {
  const { control } = useFormContext<PromptsTemplate>()
  const [width, setWidth] = useState(listWidth)
  const onRemove = () => {
    remove(index)
  }

  const onInsert = (event: MouseEvent) => {
    event.preventDefault()
    insert(index, DEFAULT_TEMPLATE)
  }

  const onResize = useCallback(
    ({ width: innerWidth }: { width: number }) => {
      if (innerWidth !== width) setWidth(innerWidth)
    },
    [width]
  )

  return (
    <ResizeObserver onResize={onResize}>
      <div className="relative group/item py-4">
        <div
          className={cl("flex justify-between items-center px-4", {
            hidden: width > RESPONSIVE_WIDTH,
          })}
        >
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
                className="w-28 py-1 group-hover/item:bg-neutral-100 group-hover/item:text-neutral-800 hover:outline hover:outline-neutral-200 uppercase font-medium border-0 text-neutral-500"
                iconClassname="group-hover/item:opacity-100 opacity-0"
                onChange={(v) => {
                  updateRole?.(index, v as ChatRole, currentField)
                  field.onChange(v)
                }}
              />
            )}
          />

          <span
            className="group-hover/item:visible invisible cursor-pointer"
            onClick={onRemove}
          >
            <IconCircleMinus className="h-5 w-5 text-neutral-500" />
          </span>
        </div>

        <div className="flex items-start px-4 py-2">
          <span className={cl("mr-8", { hidden: width <= RESPONSIVE_WIDTH })}>
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
                  className="w-28 py-1 group-hover/item:bg-neutral-100 group-hover/item:text-neutral-800 hover:outline hover:outline-neutral-200 uppercase font-medium border-0 text-neutral-500"
                  iconClassname="group-hover/item:opacity-100 opacity-0"
                  onChange={(v) => {
                    updateRole?.(index, v as ChatRole, currentField)
                    field.onChange(v)
                  }}
                />
              )}
            />
          </span>

          <span className={cl("w-full", { "ml-2": width <= RESPONSIVE_WIDTH })}>
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
                      placeholder="Insert a system message"
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
                      autoSize
                      className="border-0"
                      size="sm"
                      placeholder="Type your message here"
                    />
                  )
                }}
              />
            )}
          </span>

          <span
            className={cl("group-hover/item:visible invisible cursor-pointer", {
              hidden: width <= RESPONSIVE_WIDTH,
            })}
            onClick={onRemove}
          >
            <IconCircleMinus className="h-5 w-5 text-neutral-500" />
          </span>
        </div>

        <div className="group/insert absolute -bottom-3 z-[1] h-6 w-full text-center">
          <hr className="bg-gray-100 inset-y-1/2 absolute w-full max-w-screen-lg opacity-0 transition-opacity group-hover/insert:opacity-100" />
          <button
            onClick={onInsert}
            className="bg-white opacity-0 transition-opacity group-hover/insert:opacity-100 inline-flex justify-center items-center relative select-none rounded w-6 h-6 focus:outline-none focus:ring-1  focus:ring-gray-200 border border-gray-400 hover:border-gray-400 active:border-gray-500 text-black hover:bg-gray-100 active:bg-gray-200"
          >
            <IconPlus />
          </button>
        </div>
      </div>
    </ResizeObserver>
  )
}
