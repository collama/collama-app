import { useState } from "react"
import { Controller, useFieldArray } from "react-hook-form"
import { Select } from "~/ui/Select"
import { Button } from "~/ui/Button"
import useZodForm from "~/common/form"
import { z } from "zod"
import {
  FILTER_CONDITIONS,
  FILTER_FORM_NAME,
  type FilterType,
} from "~/ui/Filter/constants"
import { IconX } from "@tabler/icons-react"
import { type ColumnsType } from "~/ui/Table"
import {
  type FilterConditionProps,
  HandleFormError,
} from "~/ui/Filter/FilterCondition"
import {
  type Filter,
  FilterOperator,
  type FilterValue,
} from "~/common/types/props"

const DEFAULT_VALUE = { columns: "", condition: "", value: "" }
const filterSchema = z.object({
  filter: z
    .array(
      z.object({
        columns: z.string().nonempty(),
        condition: z.string().nonempty(),
        value: z.string(),
      })
    )
    .nonempty(),
})
export type FilterSchema = z.infer<typeof filterSchema>

interface DynamicFilterProps {
  columns: ColumnsType
  setFilter: (props: FilterValue) => void
  defaultValue: FilterValue
}

export function FilterForm({
  setFilter,
  defaultValue,
  columns = [],
}: DynamicFilterProps) {
  const { control, formState, reset, watch, handleSubmit } = useZodForm({
    schema: filterSchema,
    defaultValues: {
      filter: defaultValue.list,
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: FILTER_FORM_NAME,
  })
  const [conditionOperator, setConditionOperator] = useState(
    defaultValue.operator
  )

  const onSubmit = (data: { filter: Filter[] }) => {
    setFilter({ list: data.filter, operator: conditionOperator })
  }

  const onClear = () => {
    reset({ filter: [] })
    setFilter({ list: [], operator: conditionOperator })
  }

  const columnsHeader = columns.map((col) => ({
    value: col.id,
    label: col.title,
  }))

  const columnsType = columns.reduce<Record<string, FilterType>>((res, cur) => {
    res[cur.id] = (cur.type as FilterType) ?? "string"
    return res
  }, {})

  const renderFilter = (type: FilterType, props: FilterConditionProps) => {
    const Component = FILTER_CONDITIONS[type]
    return <Component {...props} />
  }

  return (
    <div className="w-[600px] rounded-lg bg-white px-4 py-2 shadow-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="py-2">
          <ul>
            {fields.map((item, index) => {
              const name =
                columnsType[watch(`${FILTER_FORM_NAME}.${index}.columns`)]
              return (
                <li key={item.id} className="mb-2.5 flex pl-4">
                  <div className="flex w-full gap-x-4">
                    <div className="flex min-w-[64px] items-center justify-end">
                      {index === 0 ? (
                        <span className="text-sm text-gray-400">where</span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() =>
                            setConditionOperator((prev) =>
                              prev === FilterOperator.And
                                ? FilterOperator.Or
                                : FilterOperator.And
                            )
                          }
                        >
                          {conditionOperator}
                        </Button>
                      )}
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-x-2">
                        <HandleFormError
                          condition={formState.errors?.filter?.[index]?.columns}
                        >
                          <Controller
                            control={control}
                            name={`${FILTER_FORM_NAME}.${index}.columns`}
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
                        {renderFilter(name ?? "string", {
                          index,
                          formState,
                          control,
                        })}
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
            classNames="text-gray-400"
            onClick={() => {
              append(DEFAULT_VALUE)
            }}
          >
            + add filter
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
