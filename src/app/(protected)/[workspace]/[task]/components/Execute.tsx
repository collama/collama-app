"use client"

import { type TaskIncludeOwner } from "~/common/types/prisma"
import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { z } from "zod"
import { Controller, FormProvider } from "react-hook-form"
import { Input } from "~/ui/Input"
import { Button } from "~/ui/Button"
import { executeTaskAction } from "~/app/(protected)/[workspace]/tasks/new/actionts"

export const Execute = ({ task }: { task: TaskIncludeOwner }) => {
  const { data } = useAwaited(
    api.task.getPromptVariables.query({ name: task.name })
  )
  const mutation = useAction(executeTaskAction)

  const schema = z.record(z.string())

  const form = useZodForm({ schema })

  return (
    <div>
      <div>
        <span>{`name: ${task.name}`}</span>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              mutation.mutate({ name: task.name, variables: data })
            )}
          >
            {(data ?? []).map((variable) => {
              return (
                <div key={variable.attrs.text} className="space-x-4">
                  <span>{variable.attrs.text}</span>
                  <Controller
                    name={variable.attrs.text}
                    render={({ field }) => {
                      return <Input size="sm" {...field} />
                    }}
                  />
                </div>
              )
            })}
            <Button htmlType="submit">Execute</Button>
          </form>
        </FormProvider>
        <div>
          <span>Result: </span>
          <span className="bg-yellow-500">{mutation.data}</span>
        </div>
      </div>
    </div>
  )
}
