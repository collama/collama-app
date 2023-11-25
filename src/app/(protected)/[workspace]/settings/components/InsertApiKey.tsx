"use client"

import { useEffect, useMemo } from "react"
import { Controller, FormProvider } from "react-hook-form"
import useAsyncEffect from "use-async-effect"
import { z } from "zod"
import { createApiKeyAction } from "~/app/(protected)/[workspace]/settings/keys/new/actions"
import useZodForm from "~/common/form"
import { sleep } from "~/common/utils"
import { zId } from "~/common/validation"
import { useAwaitedFn } from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { Button } from "~/ui/Button"
import { Input } from "~/ui/Input"
import { useNotification } from "~/ui/Notification"
import { Select } from "~/ui/Select"
import { Spin } from "~/ui/Spinner"

const schema = z.object({
  title: z.string(),
  value: z.string(),
  providerId: zId,
})

export const InsertApiKey = () => {
  const { mutate: insertAiKey, status, error } = useAction(createApiKeyAction)
  const { data: providers, loading: providersLoading } = useAwaitedFn(
    api.provider.getAll.query
  )

  const form = useZodForm({
    schema,
  })
  const [notice, holder] = useNotification()

  useEffect(() => {
    if (status === "error" && error) {
      notice.open({
        content: {
          message: "Failed to insert api key",
          description: error.message,
        },
        status: "error",
      })
    }
  }, [status, error])

  useAsyncEffect(async () => {
    if (status === "success") {
      notice.open({
        content: {
          message: "Insert api key is successfully",
        },
        status: "success",
      })
      await sleep(500)
      window.location.reload()
    }
  }, [status])

  const providerOptions = useMemo(() => {
    return providers && providers.length > 0
      ? providers.map((provider) => ({
          label: provider.name,
          value: provider.id,
        }))
      : []
  }, [providers?.length, providersLoading])

  const loading = status === "loading"

  if (providersLoading) return <Spin />

  return (
    <>
      <div className="rounded-lg border p-4">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              insertAiKey(data)
            })}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-6">
                <Controller
                  name="title"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Your key title"
                      disabled={loading}
                    />
                  )}
                />
                <Controller
                  name="providerId"
                  render={({ field }) => {
                    return (
                      <Select
                        {...field}
                        options={providerOptions}
                        disabled={loading}
                      />
                    )
                  }}
                />
              </div>
              <Controller
                name="value"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter your key"
                    disabled={loading}
                  />
                )}
              />
              <Button htmlType="submit" type="primary" loading={loading}>
                Insert
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
      {holder}
    </>
  )
}
