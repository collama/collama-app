import { type PropsWithChildren } from "react"
import { type FieldError, useFieldArray } from "react-hook-form"
import { Select } from "~/ui/Select"
import { Button } from "~/ui/Button"
import useZodForm from "~/common/form"
import { z } from "zod"
import { FILTER_CONDITION } from "~/ui/DynamicForm/constants"
import { type Header } from "@tanstack/react-table"
import { IconX } from "@tabler/icons-react"

const DEFAULT_VALUE = { columns: "", condition: "", value: "" }
const FORM_NAME = "filter"
const schema = z.object({
  filter: z
    .array(
      z.object({
        columns: z.string().nonempty(),
        condition: z.string().nonempty(),
        value: z.string().nonempty(),
      })
    )
    .nonempty(),
})

interface DynamicFilterProps<T> {
  columns: Header<T, unknown>[]
}

export function DynamicFilterForm<T>({ columns = [] }: DynamicFilterProps<T>) {
  const { register, control, formState, handleSubmit } = useZodForm({
    schema,
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: FORM_NAME,
  })

  const onSubmit = (data: any) => console.log("data", data)

  const columnsHeader = columns
    .filter((col) => col.column.columnDef.header !== "Action")
    .map((col) => ({ value: col.id }))

  return (
    <div className="w-[600px] shadow-xl rounded-lg px-4 py-2 bg-white">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="py-2">
          <ul>
            {fields.map((item, index) => {
              return (
                <li key={item.id} className="flex justify-between pl-4 mb-2.5">
                  <div className="flex space-x-2">
                    <HandleFormError
                      condition={formState.errors?.filter?.[index]?.columns}
                    >
                      <Select
                        width={100}
                        defaultValue={columnsHeader[index]}
                        options={columnsHeader}
                        form={{ ...register(`${FORM_NAME}.${index}.columns`) }}
                      />
                    </HandleFormError>
                    <HandleFormError
                      condition={formState.errors?.filter?.[index]?.condition}
                    >
                      <Select
                        width={100}
                        options={FILTER_CONDITION}
                        defaultValue={FILTER_CONDITION[0]}
                        form={{
                          ...register(`${FORM_NAME}.${index}.condition`),
                        }}
                      />
                    </HandleFormError>
                    <HandleFormError
                      condition={formState.errors?.filter?.[index]?.condition}
                    >
                      <input
                        className="w-[140px] outline-1 border rounded px-2"
                        placeholder="enter value ..."
                        {...register(`${FORM_NAME}.${index}.value`, {
                          required: true,
                        })}
                      />
                    </HandleFormError>
                  </div>
                  <span
                    className="text-gray-400 p-2 hover:bg-gray-100 rounded-lg"
                    onClick={() => remove(index)}
                  >
                    <IconX size={14} />
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
        <section className="py-2">
          <Button
            type="text"
            onClick={() => {
              append(DEFAULT_VALUE)
            }}
          >
            + add filter
          </Button>
        </section>

        <div className="border-t-2 h-14 mt-4 flex justify-end items-center">
          {fields.length > 0 && <Button htmlType="submit">Submit</Button>}
        </div>
      </form>
    </div>
  )
}

const HandleFormError = ({
  condition,
  children,
}: { condition?: FieldError } & PropsWithChildren) => {
  return (
    <div>
      {children}
      {condition && <span className="text-red-600">{condition.message}</span>}
    </div>
  )
}
