"use client"

import { Controller, FormProvider } from "react-hook-form"
import { z } from "zod"
import { executeTaskAction } from "~/app/(protected)/[workspace]/tasks/new/actions"
import useZodForm from "~/common/form"
import { type TaskIncludeOwner } from "~/common/types/prisma"
import { capitalizeFirstLetter } from "~/common/utils"
import { useAwaitedFn } from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { Button } from "~/ui/Button"
import { Input } from "~/ui/Input"
import { Spin } from "~/ui/Spinner"

const schema = z.record(z.string())

interface ExecuteTaskProps {
  task: TaskIncludeOwner
}

export const Execute = ({ task }: ExecuteTaskProps) => {
  const form = useZodForm({ schema })
  const { data, loading } = useAwaitedFn(
    () => api.task.getPromptVariables.query({ id: task.id }),
    [task.id]
  )

  const {
    mutate: executeTask,
    status,
    data: resp,
    error,
  } = useAction(executeTaskAction)

  return (
    <div>
      <div className="mb-4 space-y-4">
        <h3 className="text-xl font-bold">{task.name}</h3>
        <h4 className="text-sm text-neutral-500">{task.description}</h4>
      </div>

      <div className="mt-4 space-y-6">
        <div className="rounded-lg border p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                executeTask({ id: task.id, variables: data })
              )}
            >
              {loading && (
                <div className="flex items-center justify-center">
                  <Spin />
                </div>
              )}
              <div className="max-w-[700px]">
                {(data ?? []).map((variable) => {
                  return (
                    <div key={variable.attrs.text} className="mb-4">
                      <Controller
                        name={variable.attrs.text}
                        render={({ field }) => {
                          return (
                            <Input
                              {...field}
                              placeholder={variable.attrs.text}
                            />
                          )
                        }}
                      />
                    </div>
                  )
                })}
              </div>
              <div>
                <Button type="primary" htmlType="submit">
                  Execute
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>

      <div className="mt-4 space-y-6">
        <div className="space-y-4 rounded-lg border bg-gray-200 px-6  pb-10 pt-4">
          <div>
            <p className="text-lg font-medium text-neutral-400">Result</p>
          </div>
          {status === "loading" && (
            <div className="flex items-center justify-center">
              <Spin />
            </div>
          )}
          {resp && (
            <div className="overflow-y-hidden indent-6">
              {capitalizeFirstLetter(resp)}
            </div>
          )}
          {error && (
            <div className="overflow-y-hidden indent-6 text-red-600">
              {error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
