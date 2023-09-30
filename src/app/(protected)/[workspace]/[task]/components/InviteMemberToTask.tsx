"use client"

import { Role, type Task } from "@prisma/client"
import { useEffect } from "react"
import { Controller, FormProvider } from "react-hook-form"
import useAsyncEffect from "use-async-effect"
import { z } from "zod"
import { inviteMemberOnTaskAction } from "~/app/(protected)/[workspace]/[task]/actions"
import { InviteRoleOptions } from "~/common/constants/prisma"
import useZodForm from "~/common/form"
import { sleep } from "~/common/utils"
import { useAction } from "~/trpc/client"
import { Button } from "~/ui/Button"
import { Input } from "~/ui/Input"
import { useNotification } from "~/ui/Notification"
import { Select } from "~/ui/Select"

const schema = z.object({
  emailOrTeamName: z.string().email().or(z.string()),
  role: z.nativeEnum(Role),
})

export type InviteMemberToTaskProps = {
  task: Task
}

export const InviteMemberToTask = ({ task }: InviteMemberToTaskProps) => {
  const form = useZodForm({ schema })
  const { mutate: invite, status, error } = useAction(inviteMemberOnTaskAction)
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
              id: task.id,
              role: data.role,
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
