// "use client"
//
// import { useEffect } from "react"
// import { Controller, useFieldArray } from "react-hook-form"
// import useZodForm from "~/common/form"
// import { type Prompt, type VariableContent } from "~/common/types/prompt"
// import {
//   VARIABLE_FORM_NAME,
//   variablesSchema,
// } from "~/components/VariablesSection/contants"
// import { getVariableContents } from "~/server/api/services/prompt"
// import {
//   type Snapshot,
//   type TaskTemplate,
//   useTaskStoreTemplatesActions,
//   useTaskStoreTemplates,
// } from "~/store/task"
// import { Input } from "~/ui/Input"
//
//
// export const transformPrompts2Variable = (
//   prompts: readonly Snapshot<TaskTemplate>[]
// ): string[] => {
//   const clone = [...prompts] as TaskTemplate[]
//
//   return clone.map((prompt) => prompt.prompt)
// }
//
// const transformVariables = (arr: string[]): VariableContent[] => {
//   const contents = arr
//     .filter((item) => !!item)
//     .map((item) => JSON.parse(item) as Prompt)
//
//   return contents.flatMap((item) => getVariableContents(item.content))
// }
//
// export const VariablesSection = () => {
//   const prompt = useTaskStoreTemplates()
//   const { insertVariables, updateVariableValue } = useTaskStoreTemplatesActions()
//   const { control, register } = useZodForm({
//     schema: variablesSchema,
//   })
//
//   const { fields, replace } = useFieldArray({
//     name: VARIABLE_FORM_NAME,
//     control,
//   })
//
//   useEffect(() => {
//     const values = transformPrompts2Variable(prompt)
//     const res = transformVariables(values)
//     const transformField = res.map((field) => ({
//       name: field.attrs.text,
//       value: "",
//     }))
//
//     replace(transformField)
//     insertVariables(transformField)
//   }, [prompt])
//
//   return (
//     <div>
//       <form>
//         {fields.map((field, index) => {
//           return (
//             <div key={field.id} className="flex space-x-8 items-start">
//               <div>
//                 <div {...register(`${VARIABLE_FORM_NAME}.${index}.name`)}>
//                   {field.name}
//                 </div>
//               </div>
//
//               <Controller
//                 control={control}
//                 name={`${VARIABLE_FORM_NAME}.${index}.value`}
//                 render={({ field }) => {
//                   updateVariableValue(field.value, index)
//                   return <Input.TextArea {...field} className="h-5" />
//                 }}
//               />
//             </div>
//           )
//         })}
//       </form>
//     </div>
//   )
// }
