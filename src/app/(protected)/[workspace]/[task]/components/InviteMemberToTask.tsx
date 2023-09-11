"use client"

import { Role } from "@prisma/client"
import { Controller, FormProvider } from "react-hook-form"
import useZodForm from "~/common/form"
import { z } from "zod"
import { Input } from "~/ui/Input"
import { Select } from "~/ui/Select"
import { Button } from "~/ui/Button"
import { InviteRoleOptions } from "~/common/constants/prisma"
import { useAction } from "~/trpc/client"
import { inviteMemberToTaskAction } from "~/app/(protected)/[workspace]/tasks/new/actionts"
import { useNotification } from "~/ui/Notification"
import { useEffect } from "react"
import useAsyncEffect from "use-async-effect"
import { sleep } from "~/common/utils"

const schema = z.object({
  emailOrTeamName: z.string().email().or(z.string()),
  role: z.nativeEnum(Role),
})

export type InviteMemberToTaskProps = {
  taskName: string
  workspaceName: string
}

export const InviteMemberToTask = ({
  taskName,
  workspaceName,
}: InviteMemberToTaskProps) => {
  const form = useZodForm({ schema })
  const { mutate: invite, status, error } = useAction(inviteMemberToTaskAction)
  const [notice, holder] = useNotification()

  useEffect(() => {
    if (status === "error" && error) {
      notice.open({
        content: {
          message: "Failed to invite member",
          description: error.message,
        },
        status: "error",
      })
    }
  }, [error, status])

  useAsyncEffect(async () => {
    if (status === "success") {
      notice.open({
        content: {
          message: "Invite member is successfully",
        },
        status: "success",
      })

      await sleep(500)
      window.location.reload()
    }
  }, [status])

  return (
    <>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            invite({
              workspaceName,
              role: data.role,
              taskName,
              emailOrTeamName: data.emailOrTeamName,
            })
          })}
        >
          <div className="mt-4 space-y-6">
            <div className="rounded-lg border p-6">
              <div className="mb-4 flex max-w-[700px] space-x-4">
                <Controller
                  name="emailOrTeamName"
                  render={({ field }) => (
                    <Input {...field} placeholder="Type email or team name" />
                  )}
                />
                <Controller
                  name="role"
                  defaultValue={Role.Reader}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={InviteRoleOptions}
                      defaultValue={Role.Reader}
                    />
                  )}
                />
                <Button htmlType="submit" type="primary">
                  Invite
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
      {holder}
    </>
  )
}
