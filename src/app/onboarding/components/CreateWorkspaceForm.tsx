"use client"

import { FormProvider } from "react-hook-form"
import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import z from "zod"
import { createWorkspaceAction } from "~/app/(onboarding)/onboarding/actions"
import { useRouter } from "next/navigation"

const schema = z.object({
  workspaceName: z.string().nonempty(),
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
            router.push("/")
          })}
        >
          <div>
            <label htmlFor="create-workspace-name">Value</label>
            <input
              id="create-workspace-name"
              className="border"
              type="text"
              {...form.register("workspaceName")}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </FormProvider>
    </div>
  )
}
