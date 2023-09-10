"use client"

import { z } from "zod"
import useZodForm from "~/common/form"
import { Controller, FormProvider } from "react-hook-form"
import { useAction } from "~/trpc/client"
import { Role } from "@prisma/client"
import Loading from "~/ui/loading"
import { useEffect } from "react"
import { inviteMemberToWorkspaceAction } from "~/app/(protected)/[workspace]/actions"
import { Input } from "~/ui/Input"
import { Button } from "~/ui/Button"
import { Select } from "~/ui/Select"
import { useNotification } from "~/ui/Notification"
import { sleep } from "~/common/utils"
import useAsyncEffect from "use-async-effect"

const schema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role),
})

interface Props {
  workspaceName: string
}

export const InviteForm = (props: Props) => {
  const {
    mutate: inviteMember,
    status,
    error,
  } = useAction(inviteMemberToWorkspaceAction)
  const form = useZodForm({
    schema,
    defaultValues: {
      role: Role.Reader,
    },
  })
  const [notice, holder] = useNotification()

  useAsyncEffect(async () => {
    if (status === "success") {
      form.reset()
      notice.open({
        content: {
          message: "Invite user is successfully",
        },
        status: "success",
      })
      await sleep(500)
      window.location.reload()
    }
  }, [status])

  useEffect(() => {
    if (status === "error" && error) {
      notice.open({
        content: {
          message: "Failed to invite user",
          description: error.message
        },
        status: "error",
      })
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
              email: data.email,
              role: data.role,
              workspaceName: props.workspaceName,
            })
          })}
        >
          <div className="flex space-x-6">
            <Controller
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Type an email to invite to the workspace!"
                  className="!w-[380px]"
                />
              )}
            />
            <Controller
              name="role"
              render={({ field }) => (
                <Select
                  {...field}
                  options={[
                    { value: Role.Reader, label: "Can View" },
                    { value: Role.Writer, label: "Can Edit" },
                  ]}
                  defaultValue={Role.Reader}
                  width={100}
                />
              )}
            />
            <Button htmlType="submit" type="primary">
              Invite
            </Button>
          </div>
        </form>
      </FormProvider>
      {holder}
    </div>
  )
}
