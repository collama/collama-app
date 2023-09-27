"use client"

import { Provider } from "@prisma/client"
import { useEffect } from "react"
import { Controller, FormProvider } from "react-hook-form"
import useAsyncEffect from "use-async-effect"
import { z } from "zod"
import { createApiKeyAction } from "~/app/(protected)/[workspace]/settings/keys/new/actions"
import useZodForm from "~/common/form"
import { sleep } from "~/common/utils"
import { useAction } from "~/trpc/client"
import { Button } from "~/ui/Button"
import { Input } from "~/ui/Input"
import { useNotification } from "~/ui/Notification"
import { Select } from "~/ui/Select"

const schema = z.object({
  title: z.string(),
  value: z.string(),
  provider: z.enum([Provider.OpenAI, Provider.Cohere]),
})

export const InsertApiKey = () => {
  const { mutate: insertAiKey, status, error } = useAction(createApiKeyAction)
  const form = useZodForm({
    schema,
    defaultValues: {
      provider: Provider.OpenAI,
    },
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

  const loading = status === "loading"

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
                  name="provider"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[{ value: Provider.OpenAI, label: "Open Ai" }]}
                      defaultValue={Provider.OpenAI}
                      width={100}
                      disabled={loading}
                    />
                  )}
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
