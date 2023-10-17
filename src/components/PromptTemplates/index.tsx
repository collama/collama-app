"use client";

import { FormProvider, useFieldArray } from "react-hook-form";
import { v4 } from "uuid";
import useZodForm from "~/common/form";
import { PromptField } from "~/components/PromptTemplates/PromptField";
import { DEFAULT_TEMPLATE, PROMPT_FORM_NAME, promptSchema } from "~/components/PromptTemplates/contants";
import { useTaskStoreAction } from "~/store/task";
import { Button } from "~/ui/Button";


export const PromptTemplates = () => {
  const methods = useZodForm({
    schema: promptSchema,
    defaultValues: {
      prompts: [{ ...DEFAULT_TEMPLATE, role: "system" }],
    },
  })

  const { fields, insert, append, remove } = useFieldArray({
    control: methods.control,
    name: PROMPT_FORM_NAME,
  })

  const {insertTemplate} = useTaskStoreAction()

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
                insertTemplate({ ...DEFAULT_TEMPLATE, id: v4() })
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
