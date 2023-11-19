import { type FC, useEffect } from "react"
import { Controller, useFieldArray } from "react-hook-form"
import useZodForm from "~/common/form"
import {
  type Variable,
  VARIABLE_FORM_NAME,
  variablesSchema,
} from "~/components/VariablesSection/contants"
import { Input } from "~/ui/Input"

interface VariablesSectionProps {
  data: Variable[]
  updateContent: (index: number, value: string) => void
}

export const VariablesSection: FC<VariablesSectionProps> = ({
  data,
  updateContent,
}) => {
  const { control, register } = useZodForm({
    schema: variablesSchema,
  })

  const { fields, replace } = useFieldArray({
    name: VARIABLE_FORM_NAME,
    control,
  })

  useEffect(() => {
    replace(data)
  }, [data.length])

  return (
    <form>
      <div className="px-4 space-y-4">
        {fields.map((field, index) => {
          return (
            <div key={field.id} className="flex space-x-8 items-start">
              <div>
                <div
                  {...register(`${VARIABLE_FORM_NAME}.${index}.name`)}
                  className="text-sm w-[100px] truncate"
                >
                  {field.name}
                </div>
              </div>

              <Controller
                control={control}
                name={`${VARIABLE_FORM_NAME}.${index}.value`}
                render={({ field }) => {
                  updateContent(index, field.value)
                  return (
                    <Input.TextArea
                      {...field}
                      className="border-0 h-5 hover:bg-neutral-50 focus:bg-neutral-100"
                      size="sm"
                      placeholder="enter value here"
                    />
                  )
                }}
              />
            </div>
          )
        })}
        {!fields ||
          (fields.length <= 0 && (
            <div className="p-4 border border-violet-300 bg-violet-50 rounded-lg">
              <div className="text-violet-900 font-medium">Tip</div>
              <div className="text-violet-900">
                {
                  "Press '/' to use a command in your chat template for creating variables"
                }
              </div>
            </div>
          ))}
      </div>
    </form>
  )
}
