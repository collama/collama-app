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

const schema = z.object({
  emailOrTeamId: z.string().email().or(z.string()),
  role: z.nativeEnum(Role),
})

type InviteMemberToTaskProps = {
  taskName: string
  workspaceName: string
}

export const InviteMemberToTask = ({
  taskName,
  workspaceName,
}: InviteMemberToTaskProps) => {
  const form = useZodForm({ schema })
  const invite = useAction(inviteMemberToTaskAction)

  return (
    <div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            invite.mutate({
              workspaceName,
              role: data.role,
              taskName,
              emailOrTeamId: data.emailOrTeamId,
            })
          })}
        >
          <div className="mb-4 flex space-x-4">
            <div>
              <div>Email Or TeamId</div>
              <Controller
                name="emailOrTeamId"
                render={({ field }) => (
                  <Input {...field} size="sm" className="border" />
                )}
              />
            </div>
            <div>
              <div>Role</div>
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
            </div>
          </div>
          <Button htmlType="submit" type="primary">
            Invite
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}
