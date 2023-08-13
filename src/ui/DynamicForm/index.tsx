import { type PropsWithChildren } from "react"
import { type FieldError, useFieldArray } from "react-hook-form"
import { Select } from "~/ui/Select"
import { Button } from "~/ui/Button"
import useZodForm from "~/common/form"
import { z } from "zod"
import { FILTER_CONDITION, type FilterType } from "~/ui/DynamicForm/constants"
import { IconX } from "@tabler/icons-react"
import { type Filter } from "~/ui/Table/components/Filter"
import { type ColumnsType } from "~/ui/Table"
import { Input } from "~/ui/Input"

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

enum Condition {
  And = "And",
  Or = "Or",
}

export type FilterValue = {
  filter: Filter[]
}

interface DynamicFilterProps {
  columns: ColumnsType
  setFilter: (filter: Filter[]) => void
}

export function DynamicFilterForm({
  columns = [],
  setFilter,
}: DynamicFilterProps) {
  const { control, formState, reset, watch, handleSubmit } = useZodForm({
    schema,
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: FORM_NAME,
  })
  const [conditionOperator, setConditionOperator] = useState(false)

  const onSubmit = (data: FilterValue) => setFilter(data.filter)

  const columnsHeader = columns.map((col) => ({
    value: col.id,
    label: col.title,
  }))

  const columnsType = columns.reduce<Record<string, FilterType>>((res, cur) => {
    res[cur.id] = (cur.type as FilterType) ?? "string"
    return res
  }, {})

  return (
    <div className="w-[600px] rounded-lg bg-white px-4 py-2 shadow-xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="py-2">
          <ul>
            {fields.map((item, index) => {
              const name = columnsType[watch(`${FORM_NAME}.${index}.columns`)]
              return (
                <li key={item.id} className="mb-2.5 flex pl-4">
                  <div className="flex w-full gap-x-4">
                    <div className="flex min-w-[64px] items-center justify-end">
                      {index === 0 ? (
                        <span className="text-sm text-gray-400">where</span>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setConditionOperator((prev) => !prev)}
                        >
                          {conditionOperator ? Condition.Or : Condition.And}
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
                            name={`${FORM_NAME}.${index}.columns`}
                            render={({ field }) => {
                              return (
                                <Select
                                  width={100}
                                  options={columnsHeader}
                                  defaultOpen={true}
                                  {...field}
                                />
                              )
                            }}
                          />
                        </HandleFormError>
                        <HandleFormError
                          condition={
                            formState.errors?.filter?.[index]?.condition
                          }
                        >
                          <Controller
                            control={control}
                            name={`${FORM_NAME}.${index}.condition`}
                            render={({ field }) => {
                              return (
                                <Select
                                  width={100}
                                  options={FILTER_CONDITION[name ?? "string"]}
                                  {...field}
                                />
                              )
                            }}
                          />
                        </HandleFormError>
                        <HandleFormError
                          condition={
                            formState.errors?.filter?.[index]?.condition
                          }
                        >
                          <Controller
                            control={control}
                            name={`${FORM_NAME}.${index}.value`}
                            render={({ field }) => {
                              return (
                                <Input
                                  className="w-[140px] rounded border outline-1"
                                  placeholder="enter value ..."
                                  size="sm"
                                  {...field}
                                />
                              )
                            }}
                          />
                        </HandleFormError>
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
              <Button onClick={() => reset({ filter: [] })}>Clear</Button>
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
