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
import { TeamRoleOptions } from "~/common/constants/prisma"
import { type TeamPageParams } from "~/app/(protected)/[workspace]/teams/[team]/page"
import { useNotification } from "~/ui/Notification"
import { useEffect } from "react"
import useAsyncEffect from "use-async-effect"
import { sleep } from "~/common/utils"

const schema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(TeamRole),
})

export const InviteTeamForm = ({ teamSlug, workspaceSlug }: TeamPageParams) => {
  const {
    mutate: inviteMember,
    status,
    error,
  } = useAction(inviteMemberToTeamAction)
  const form = useZodForm({ schema })
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
  }, [status, error])

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
            inviteMember({
              workspaceSlug,
              teamSlug,
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
      {holder}
    </>
  )
}
