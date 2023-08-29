"use client"

import { z } from "zod"
import { useAction } from "~/trpc/client"
import { createTeamAction } from "~/app/(protected)/[workspace]/actions"
import useZodForm from "~/common/form"
import { useEffect } from "react"
import Loading from "~/ui/loading"
import { FormProvider } from "react-hook-form"

interface Props {
  workspaceName: string
}

const schema = z.object({
  name: z.string(),
  description: z.string(),
})

export const CreateTeamForm = (props: Props) => {
  const { mutate: createTeam, status, error } = useAction(createTeamAction)
  const form = useZodForm({
    schema,
  })

  useEffect(() => {
    if (status === "success") {
      alert("Invited")
    }
  }, [status])

  useEffect(() => {
    if (status === "error" && error) {
      console.log(error)
    }
  }, [error, status])

  if (status === "loading") {
    return <Loading />
  }

  return (
    <div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            createTeam({
              ...data,
              workspaceName: props.workspaceName,
            })
          })}
        >
          <input className="border" {...form.register("name")} />
          <input className="border" {...form.register("description")} />

          <button type="submit" className="border bg-gray-400">
            Create
          </button>
        </form>
      </FormProvider>
    </div>
  )
}
