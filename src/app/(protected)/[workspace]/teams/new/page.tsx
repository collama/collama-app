"use client"

import { FormProvider } from "react-hook-form"
import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zId } from "~/common/validation"
import { createTeamAction } from "~/app/(protected)/[workspace]/teams/new/actionts"
import { PageProps } from "~/common/types/props"

const schema = z.object({
  teamName: zId,
})

interface NewTeamProps {
  workspace: string
}

export default function NewTeamPage({ params }: PageProps<NewTeamProps>) {
  const router = useRouter()
  const mutation = useAction(createTeamAction)
  const form = useZodForm({
    schema,
  })
  const errors = form.formState.errors

  return (
    <div>
      <h1>Create new team</h1>
      <div>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              mutation.mutate({
                ...data,
                workspaceName: params.workspace,
              })

              router.push(`/${params.workspace}`)
            })}
          >
            <div>
              <label htmlFor="create-team-name">Name</label>
              <input
                id="create-team-name"
                className="border"
                type="text"
                {...form.register("teamName")}
              />
              {errors.teamName && <p>{errors.teamName.message}</p>}
            </div>
            <button type="submit">Create</button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
