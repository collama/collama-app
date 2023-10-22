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
    <div>
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
                render={({ field }) => {
                  updateContent(index, field.value)
                  return <Input.TextArea {...field} className="h-5" />
                }}
              />
            </div>
          )
        })}
      </form>
    </div>
  )
}
