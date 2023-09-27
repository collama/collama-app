"use client"

import { type Workspace } from "@prisma/client"
import { useEffect } from "react"
import { Controller, FormProvider } from "react-hook-form"
import useAsyncEffect from "use-async-effect"
import { z } from "zod"
import { createTeamAction } from "~/app/(protected)/[workspace]/actions"
import useZodForm from "~/common/form"
import { sleep } from "~/common/utils"
import { useAction } from "~/trpc/client"
import { Button } from "~/ui/Button"
import { Input } from "~/ui/Input"
import { useNotification } from "~/ui/Notification"
import Loading from "~/ui/loading"

interface Props {
  workspace: Workspace
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
  const [notice, holder] = useNotification()

  useAsyncEffect(async () => {
    if (status === "success") {
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
            createTeam({
              ...data,
              workspaceSlug: props.workspace.slug,
            })
          })}
        >
          <div className="flex space-x-6">
            <Controller
              name="name"
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    className="!w-[350px]"
                    placeholder="Team name"
                  />
                )
              }}
            />
            <Controller
              name="description"
              render={({ field }) => (
                <Input
                  {...field}
                  className="!w-[350px]"
                  placeholder="Description ..."
                />
              )}
            />

            <Button htmlType="submit" type="primary">
              Create
            </Button>
          </div>
        </form>
      </FormProvider>
      {holder}
    </div>
  )
}
