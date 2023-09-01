"use client"

import { FormProvider } from "react-hook-form"
import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import z from "zod"
import { useRouter } from "next/navigation"
import { createWorkspaceAction } from "~/app/actions"

const schema = z.object({
  name: z.string().nonempty(),
})

export default function CreateWorkspaceForm() {
  const router = useRouter()
  const mutation = useAction(createWorkspaceAction)
  const form = useZodForm({
    schema,
  })

  return (
    <div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            mutation.mutate(data)
            // router.push(`/${data.name}`)
          })}
        >
          <div>
            <label htmlFor="create-workspace-name">Value</label>
            <input
              id="create-workspace-name"
              className="border"
              type="text"
              {...form.register("name")}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </FormProvider>
    </div>
  )
}
