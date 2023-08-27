"use client"
import { Controller, FormProvider } from "react-hook-form"
import { Input } from "~/ui/Input"
import { Select } from "~/ui/Select"
import { TeamRole } from "@prisma/client"
import { z } from "zod"
import { useAction } from "~/trpc/client"
import { inviteMemberToTeamAction } from "~/app/(protected)/[workspace]/actions"
import useZodForm from "~/common/form"
import { Button } from "~/ui/Button"

const TeamRoleOptions = [{ value: TeamRole.Member }, { value: TeamRole.Admin }]

const schema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(TeamRole),
})

type InviteTeamFormProps = {
  teamId: string
  workspaceName: string
}

export const InviteTeamForm = ({
  teamId,
  workspaceName,
}: InviteTeamFormProps) => {
  const { mutate: inviteMember } = useAction(inviteMemberToTeamAction)
  const form = useZodForm({ schema })

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          inviteMember({
            workspaceName,
            teamId,
            role: data.role,
            email: data.email,
          })
        })}
      >
        <div className="mb-4 flex space-x-4">
          <div>
            <div>Email</div>
            <Controller
              name="email"
              render={({ field }) => (
                <Input {...field} size="sm" type="email" className="border" />
              )}
            />
          </div>
          <div>
            <div>Role</div>
            <Controller
              name="role"
              defaultValue={TeamRole.Member}
              render={({ field }) => (
                <Select
                  {...field}
                  options={TeamRoleOptions}
                  defaultValue={TeamRole.Member}
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
  )
}
