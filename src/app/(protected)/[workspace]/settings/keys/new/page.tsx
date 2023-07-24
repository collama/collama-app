"use client"

import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { FormProvider } from "react-hook-form"
import { Provider } from "@prisma/client"
import { z } from "zod"
import { createApiKeyAction } from "~/app/(protected)/[workspace]/settings/keys/new/actions"
import { useRouter } from "next/navigation"
import { PageProps } from "~/common/types/props"

const schema = z.object({
  title: z.string(),
  value: z.string(),
  provider: z.enum([Provider.OpenAI, Provider.Cohere]),
})

interface Props {
  workspace: string
}

export default function NewKeyPage({ params }: PageProps<Props>) {
  const router = useRouter()
  const mutation = useAction(createApiKeyAction)
  const form = useZodForm({
    schema,
  })

  return (
    <div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            mutation.mutate(data)
            router.push(`/${params.workspace}/settings/keys`)
          })}
        >
          <div>
            <label htmlFor="create-api-key-title">Title</label>
            <input
              id="create-api-key-title"
              className="border"
              type="text"
              {...form.register("title")}
            />
          </div>
          <div>
            <label htmlFor="create-api-key-provider">Provider</label>
            <select id="create-api-key-provider" {...form.register("provider")}>
              <option value={Provider.OpenAI}>OpenAI</option>
              <option value={Provider.Cohere}>Cohere</option>
            </select>
          </div>
          <div>
            <label htmlFor="create-api-key-name">Value</label>
            <input
              id="create-api-key-name"
              className="border"
              type="text"
              {...form.register("value")}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </FormProvider>
    </div>
  )
}
