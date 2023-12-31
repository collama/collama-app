import type { ChatRole as ChatRoleType, Message } from "@prisma/client"
import { ChatRole } from "@prisma/client"
import { IconPlayerPlay, IconPlus } from "@tabler/icons-react"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
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
  stop: () => void
}

type PromptTemplatesProps = {
  isLoading?: boolean
} & (Control | Submit)

export type TemplateRef = {
  appendField: (message: Message) => void
  updateField: (index: number, message: Message) => void
} | null

export const PromptTemplates = forwardRef<TemplateRef, PromptTemplatesProps>(
  function PromptTemplates({ isLoading = false, ...props }, ref) {
    const [submitProps, setSubmitProps] = useState<Submit | null>(null)
    const [controlProps, setControlProps] = useState<Control | null>(null)
    const wrapperRef = useRef<HTMLUListElement | null>(null)

    useEffect(() => {
      props.data ? setControlProps(props) : setSubmitProps(props)
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
      update: fieldUpdate,
    } = useFieldArray({
      control: methods.control,
      name: PROMPT_FORM_NAME,
    })

    useImperativeHandle(
      ref,
      () => ({
        appendField: (message: Message) => {
          fieldAppend(message)
        },
        updateField: (index: number, value: Message) => {
          fieldUpdate(index, value)
        },
      }),
      []
    )

    useEffect(() => {
      if (
        controlProps &&
        (!props.data || (props.data && props.data.length <= 0))
      ) {
        const initData = {
          ...DEFAULT_TEMPLATE,
          role: ChatRole.System,
          // content: "You are a helpful assistant",
        }

        fieldAppend(initData)
        controlProps?.append(initData)
      }

      if (submitProps) {
        fieldAppend({ ...DEFAULT_TEMPLATE, content: "" })
      }
    }, [submitProps, controlProps])

    const onAppend = () => {
      submitProps
        ? fieldAppend({ ...DEFAULT_TEMPLATE, content: "" })
        : fieldAppend({ ...DEFAULT_TEMPLATE, role: ChatRole.System })

      controlProps?.append(DEFAULT_TEMPLATE)
    }

    const onInsert = (index: number, value: Message) => {
      fieldInsert(index + 1, value)

      controlProps?.insert(index, value)
    }

    const onRemove = (index: number) => {
      fieldRemove(index)

      controlProps?.remove(index)
    }

    const onSubmit = (data: PromptsTemplate) => {
      submitProps?.submit(data.prompts)
    }

    return (
      <div>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <ul ref={wrapperRef}>
              {fields.map((field, index) => (
                <PromptField
                  key={field.id}
                  currentField={field}
                  index={index}
                  remove={onRemove}
                  insert={onInsert}
                  updateRole={controlProps?.updateRole}
                  updateContent={controlProps?.updateContent}
                  isTemplate={!submitProps}
                  listWidth={wrapperRef.current?.offsetWidth ?? 0}
                />
              ))}
            </ul>

            <section className="py-2 px-4 mt-6 pb-6 space-x-4">
              <Button
                size="sm"
                onClick={onAppend}
                prefix={<IconPlus className="h-4 w-4" />}
              >
                {!submitProps ? "New template" : "Message"}
              </Button>
              {submitProps && (
                <>
                  {isLoading && (
                    <Button
                      size="sm"
                      htmlType="button"
                      onClick={submitProps.stop}
                    >
                      Cancel
                    </Button>
                  )}
                  {!isLoading && (
                    <Button
                      size="sm"
                      type="primary"
                      htmlType="submit"
                      ghost
                      prefix={<IconPlayerPlay className="h-4 w-4" />}
                    >
                      Run
                    </Button>
                  )}
                </>
              )}
            </section>
          </form>
        </FormProvider>
      </div>
    )
  }
)
