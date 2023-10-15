"use client"

import { useEffect } from "react"
import { Controller, useFieldArray } from "react-hook-form"
import { useSnapshot } from "valtio/react"
import useZodForm from "~/common/form"
import { Paragraph } from "~/common/types/prompt"
import { Template } from "~/components/PromptTemplates/contants"
import {
  VARIABLE_FORM_NAME,
  variablesSchema,
} from "~/components/VariablesSection/contants"
import { Snapshot, taskStore, useTaskStorePrompts } from "~/store/task"
import { Input } from "~/ui/Input"

// export const transformPrompts2Variable = (
//   prompts: readonly Snapshot<Template>[]
// ): Array<Paragraph[] | null> => {
//   // const json = JSON.stringify(prompts)
//   // const clone = JSON.parse(json) as Template[]
//
//
//   const clone = [...prompts] as Template[]
//   console.log(clone)
//
//   return clone.map((prompt) => (prompt.prompt ? prompt.prompt?.content : null))
// }

// const tranformVariables = (arr: Variable[]): Variable[] => {
//   return arr.map(item => {
//     const variableContents = getVariableContents(item.value)
//   })
// }

export const VariablesSection = () => {
  const prompt = useTaskStorePrompts()
  const { control, register } = useZodForm({
    schema: variablesSchema,
  })

  const { fields, replace } = useFieldArray({
    name: VARIABLE_FORM_NAME,
    control,
  })

  // useEffect(() => {
  //   const value = transformPrompts2Variable(prompt)
  //   //
  //   // const variable =
  //   //
  //   // replace(value)
  //   console.log(value)
  //   // console.log(transformPrompts2Variable(prompt))
  // }, [prompt])




  return (
    <div>
      <div>{prompt.map((item, index) => <span key={index}>{JSON.stringify(item)}</span>)}</div>
      <form>
        {fields.map((field, index) => {
          return (
            <div key={field.id} className="flex space-x-8 items-start">
              <div>
                <div {...register(`${VARIABLE_FORM_NAME}.${index}.name`)}>
                  {field.name}
                </div>
              </div>

              <Controller
                control={control}
                name={`${VARIABLE_FORM_NAME}.${index}.value`}
                render={({ field }) => (
                  <Input.TextArea {...field} className="h-5" />
                )}
              />
            </div>
          )
        })}
      </form>
    </div>
  )
}
