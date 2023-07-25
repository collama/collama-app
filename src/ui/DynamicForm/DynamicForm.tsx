"use client"

import { FormProvider } from "react-hook-form"
import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { createTeamAction } from "~/app/(protected)/[workspace]/teams/new/actionts"
import { FC } from "react"
import { Header } from "@tanstack/react-table"
import { Select } from "~/ui/Select"

const schema = z.object({
  columns: z.string(),
  value: z.string(),
  select: z.string(),
})

interface NewTeamProps {
  columns: Header<any, any>[]
}

export const DynamicForm: FC<NewTeamProps> = ({ columns }) => {
  const router = useRouter()
  const mutation = useAction(createTeamAction)
  const form = useZodForm({
    schema,
  })
  const errors = form.formState.errors

  const columnsHeader = columns
    .filter((col) => col.column.columnDef.header !== "Action")
    .map((col) => ({ value: col.id }))

  return (
    <div>
      <div>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) => console.log(data))}
            // onSubmit={form.handleSubmit((data) => {
            //   mutation.mutate({
            //     ...data,
            //     workspaceName: params.workspace,
            //   })
            //   router.push(params.workspace)
            // })}
            className="flex py-4"
          >
            <div>
              <label htmlFor="filter-name">Columns</label>
              <input
                id="filter-name"
                className="border"
                type="text"
                {...form.register("columns")}
              />
            </div>
            <div>
              <label htmlFor="filter-name">Value</label>
              <input
                id="filter-name"
                className="border"
                type="text"
                {...form.register("value")}
              />
            </div>
            <Select
              options={columnsHeader}
              form={{ ...form.register("select") }}
            />
            <button type="submit">Create</button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
