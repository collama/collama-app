"use client"

import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { FormProvider } from "react-hook-form"
import z from "zod"
import { useEffect } from "react"
import { inviteAction } from "~/app/(protected)/[workspace]/[team]/actions"

const schema = z.object({
  email: z.string().email(),
})

interface InvitationProps {
  team: string
}

export default function Invitation({ team }: InvitationProps) {
  const mutation = useAction(inviteAction)
  const form = useZodForm({
    schema,
  })
  const errors = form.formState.errors

  useEffect(() => {
    if (mutation.error) {
      alert(mutation.error)
    }
  }, [mutation.error])

  return (
    <div>
      <h1>Create new team</h1>
      <div>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              mutation.mutate({
                ...data,
                team,
              })
            })}
          >
            <div>
              <label htmlFor="create-team-name">Email</label>
              <input
                id="create-team-name"
                className="border"
                type="text"
                {...form.register("email")}
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <button className="border-2 p-2" type="submit">
              Invite
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
