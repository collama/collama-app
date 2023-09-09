import { Controller, useFieldArray } from "react-hook-form"
import { Select } from "~/ui/Select"
import { Button } from "~/ui/Button"
import useZodForm from "~/common/form"
import { z } from "zod"
import { IconX } from "@tabler/icons-react"
import { type ColumnType } from "~/ui/Table"
import { HandleFormError } from "~/ui/Filter/FilterCondition"
import { SORT_CONDITION, SORT_FORM_NAME } from "~/ui/Sort/contants"
import { type Sort, type SortValue } from "~/common/types/props"

const DEFAULT_VALUE = { columns: "", condition: "asc" }
export const sortSchema = z.object({
  sort: z
    .array(
      z.object({
        columns: z.string().nonempty(),
        condition: z.string().nonempty(),
      })
    )
    .nonempty(),
})

interface DynamicFilterProps {
  columns: ColumnType[]
  setSort: (props: SortValue) => void
  defaultValue: SortValue
}

export function SortForm({
  setSort,
  defaultValue,
  columns = [],
}: DynamicFilterProps) {
  const { control, formState, reset, handleSubmit } = useZodForm({
    schema: sortSchema,
    defaultValues: { sort: defaultValue.list },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: SORT_FORM_NAME,
  })

  const onSubmit = (data: { sort: Sort[] }) => {
    setSort({ list: data.sort })
  }

  const onClear = () => {
    reset({ sort: [] })
    setSort({ list: [] })
  }

  const columnsHeader = columns.map((col) => ({
    value: col.id.toString(),
    label: col.title.toString(),
  }))

  return (
    <div className="w-[600px] rounded-lg bg-white px-4 py-2 shadow-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="py-2">
          <ul>
            {fields.map((item, index) => {
              return (
                <li key={item.id} className="mb-2.5 flex pl-4">
                  <div className="flex w-full gap-x-4">
                    <div className="flex min-w-[64px] items-center justify-end">
                      {index === 0 ? (
                        <span className="text-sm text-gray-400">where</span>
                      ) : (
                        <span className="text-sm text-gray-400">And</span>
                      )}
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-x-2">
                        <HandleFormError
                          condition={formState.errors?.sort?.[index]?.columns}
                        >
                          <Controller
                            control={control}
                            name={`${SORT_FORM_NAME}.${index}.columns`}
                            render={({ field }) => {
                              return (
                                <Select
                                  {...field}
                                  width={100}
                                  options={columnsHeader}
                                  defaultValue={{ value: field.value }}
                                />
                              )
                            }}
                          />
                        </HandleFormError>
                        <HandleFormError
                          condition={formState.errors?.sort?.[index]?.columns}
                        >
                          <Controller
                            control={control}
                            name={`${SORT_FORM_NAME}.${index}.condition`}
                            render={({ field }) => {
                              return (
                                <Select
                                  {...field}
                                  width={150}
                                  options={SORT_CONDITION}
                                  defaultValue={{ value: field.value }}
                                />
                              )
                            }}
                          />
                        </HandleFormError>
                      </div>
                    </div>
                    <div className="flex w-8 items-center justify-center">
                      <span
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
                        onClick={() => remove(index)}
                      >
                        <IconX size={14} />
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <section className="py-2">
          <Button
            type="text"
            size="sm"
            className="text-gray-400"
            onClick={() => {
              append(DEFAULT_VALUE)
            }}
          >
            + add sort
          </Button>
        </section>

        <div className="mt-4 flex h-14 items-center justify-end border-t-2">
          {fields.length > 0 && (
            <section className="space-x-2">
              <Button onClick={onClear}>Clear</Button>
              <Button htmlType="submit" type="primary">
                Submit
              </Button>
            </section>
          )}
        </div>
      </form>
    </div>
  )
}
