"use client"

import { z } from "zod"
import useZodForm from "~/common/form"
import { FormProvider } from "react-hook-form"
import { useAction } from "~/trpc/client"
import { Role } from "@prisma/client"
import Loading from "~/ui/loading"
import { useEffect } from "react"
import { inviteMemberAction } from "~/app/(protected)/[workspace]/actions"

const schema = z.object({
  emailOrName: z.string(),
  role: z.nativeEnum(Role),
})

interface Props {
  workspaceName: string
}

export const InviteForm = (props: Props) => {
  const { mutate: inviteMember, status, error } = useAction(inviteMemberAction)
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
            inviteMember({
              emailOrTeamName: data.emailOrName,
              role: data.role,
              workspaceName: props.workspaceName,
            })
          })}
        >
          <input className="border" {...form.register("emailOrName")} />
          <select {...form.register("role")}>
            <option value={Role.Reader}>Can View</option>
            <option value={Role.Writer}>Can Edit</option>
          </select>
          <button type="submit" className="border bg-gray-400">
            Invite
          </button>
        </form>
      </FormProvider>
    </div>
  )
}
