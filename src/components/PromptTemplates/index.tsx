"use client"

import { FormProvider, useFieldArray } from "react-hook-form"
import useZodForm from "~/common/form"
import { PromptField } from "~/components/PromptTemplates/PromptField"
import {
  DEFAULT_TEMPLATE,
  PROMPT_FORM_NAME,
  promptSchema,
} from "~/components/PromptTemplates/contants"
import { Button } from "~/ui/Button"

export const PromptTemplates = () => {
  const methods = useZodForm({
    schema: promptSchema,
    defaultValues: {
      prompts: [
        {
          role: "system",
          prompt: "",
        },
      ],
    },
  })

  const { fields, insert, append, remove } = useFieldArray({
    control: methods.control,
    name: PROMPT_FORM_NAME,
  })

  const data = methods.watch()
  console.log("data", data)

  return (
    <div>
      <FormProvider {...methods}>
        <form>
          <ul>
            {fields.map((field, index) => (
              <PromptField
                key={field.id}
                index={index}
                remove={remove}
                insert={insert}
              />
            ))}
          </ul>

          <section className="py-2">
            <Button
              size="sm"
              className="text-gray-400 rounded-lg"
              onClick={() => {
                append(DEFAULT_TEMPLATE)
              }}
            >
              new template
            </Button>
          </section>
        </form>
      </FormProvider>
    </div>
  )
}
