"use client"

import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { z } from "zod"
import { Controller, FormProvider } from "react-hook-form"
import { Input } from "~/ui/Input"
import { Button } from "~/ui/Button"
import { executeTaskAction } from "~/app/(protected)/[workspace]/tasks/new/actionts"
import { capitalizeFirstLetter } from "~/common/utils"
import { Spin } from "~/ui/Spinner"
import type { PageProps } from "~/common/types/props"
import { useEffect, useState } from "react"

type Props = {
  task: string
}

export default function Page({ params }: PageProps<Props>) {
  const { data: task, loading: taskLoading } = useAwaited(
    api.task.getPublicTaskBySlug.query({ slug: params.task })
  )
  const { data: variables, loading: variablesLoading } = useAwaited(
    api.task.getPromptVariablesOnPublic.query({ slug: params.task })
  )
  const {
    mutate: executeTask,
    status,
    data: resp,
    error,
  } = useAction(executeTaskAction)
  const [isLoading, setIsLoading] = useState(true)

  const schema = z.record(z.string())

  const form = useZodForm({ schema })

  useEffect(() => {
    setIsLoading(true)

    if (!taskLoading && !variablesLoading) {
      setIsLoading(false)
    }
  }, [taskLoading, variablesLoading])

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spin />
      </div>
    )

  if (!task) return <div>Task not found</div>

  return (
    <div className="max-w-screen-xl">
      <div className="mb-4 space-y-4">
        <h3 className="text-xl font-bold">{task.name}</h3>
        <h4 className="text-sm text-neutral-500">{task.description}</h4>
      </div>

      <div className="mt-4 space-y-6">
        <div className="rounded-lg border p-6">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                executeTask({ name: task.name, variables: data })
              )}
            >
              <div className="max-w-[700px]">
                {(variables ?? []).map((variable) => {
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
