"use client"

import { IconCircleMinus, IconPlus } from "@tabler/icons-react"
import { Controller, useFieldArray } from "react-hook-form"
import useZodForm from "~/common/form"
import {
  EXECUTE_FROM_NAME, type ExecuteDto,
  executeSchema,
  USER_FIElD,
} from "~/components/Execute/contants"
import { Button } from "~/ui/Button"
import { Input } from "~/ui/Input"
import { Select } from "~/ui/Select"
import {useTaskStoreVariables} from "~/store/task";

export const Execute = () => {
  const { control, handleSubmit } = useZodForm({ schema: executeSchema })

  const { fields, remove, insert, append } = useFieldArray({
    control,
    name: EXECUTE_FROM_NAME,
  })

  const variables = useTaskStoreVariables()

  const onSubmit = (data: ExecuteDto) => {
    console.log(variables)
    console.log(data)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => {
          return (
            <div
              key={field.id}
              className="relative flex space-x-8 items-start p-4 border-b group/item odd:bg-white even:bg-gray-50"
            >
              <Controller
                control={control}
                name={`${EXECUTE_FROM_NAME}.${index}.role`}
                render={({ field }) => (
                  <Select
                    {...field}
                    size="sm"
                    defaultValue={field.value as string}
                    options={[
                      { value: "user" },
                      { value: "system" },
                      { value: "assistant" },
                    ]}
                    className="bg-neutral-100 group-focus:bg-indigo-300 uppercase font-medium"
                  />
                )}
              />
              <Controller
                control={control}
                name={`${EXECUTE_FROM_NAME}.${index}.content`}
                render={({ field }) => {
                  return <Input {...field} />
                }}
              />
              <span
                className="group-hover/item:visible invisible"
                onClick={() => remove(index)}
              >
                <IconCircleMinus />
              </span>

              <div className="group/insert absolute -bottom-3 z-[1] h-6 w-full text-center">
                <button
                  onClick={(event) => {
                    event.preventDefault()
                    insert(index + 1, USER_FIElD)
                  }}
                  className="bg-white opacity-0 transition-opacity group-hover/insert:opacity-100 inline-flex justify-center items-center relative select-none rounded w-6 h-6 focus:outline-none focus:ring-1  focus:ring-gray-200 border border-gray-400 hover:border-gray-400 active:border-gray-500 text-black hover:bg-gray-100 active:bg-gray-200"
                >
                  <IconPlus />
                </button>
              </div>
            </div>
          )
        })}
      <section>
        <Button
          size="sm"
          className="text-gray-400 rounded-lg"
          onClick={() => append(USER_FIElD)}
        >
          + add
        </Button>
        <Button
          size="sm"
          className="text-gray-400 rounded-lg"
          htmlType='submit'
        >
          execute
        </Button>
      </section>
      </form>

    </div>
  )
}
