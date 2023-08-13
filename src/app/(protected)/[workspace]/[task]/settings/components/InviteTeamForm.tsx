"use client"

import { z } from "zod"
import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { FormProvider } from "react-hook-form"
import { inviteMemberToTeamAction } from "~/app/(protected)/[workspace]/[task]/settings/actions"

const schema = z.object({
  email: z.string().email(),
})

interface Props {
  teamName: string
}

export default function InviteTeamForm({ teamName }: Props) {
  const mutation = useAction(inviteMemberToTeamAction)
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
                teamName,
                email: data.email,
              })
            })}
          >
            <div>
              <label htmlFor="create-team-name">Name</label>
              <input
                id="create-team-name"
                className="border"
                type="text"
                {...form.register("email")}
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <button type="submit">Create</button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
