"use client"

import { Controller } from "react-hook-form"
import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import z from "zod"
import { useRouter } from "next/navigation"
import { createWorkspaceAction } from "~/app/actions"
import { Input } from "~/ui/input"
import { Button } from "~/ui/Button"
import { useEffect } from "react"
import cx from "classnames"
import { useNotification } from "~/ui/Notification"

const schema = z.object({
  name: z.string().nonempty(),
})

export default function CreateWorkspaceForm() {
  const router = useRouter()
  const {
    mutate: createWorkspace,
    status,
    data,
  } = useAction(createWorkspaceAction)
  const { handleSubmit, control } = useZodForm({
    schema,
  })
  const [notice, holder] = useNotification()

  const isLoading = status === "loading"
  const isError = status === "error"
  const isSuccess = status === "success"

  useEffect(() => {
    if (isSuccess && data) {
      router.push(`/${data.name}`)
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      notice.open({
        content: { message: "Failed to create workspace" },
        status: "error",
      })
    }
  }, [isError])

  return (
    <div
      className={cx("rounded-lg border px-10 py-5 shadow", {
        "pointer-events-none": isLoading,
      })}
    >
      <div>
        <h3 className="mb-4 text-center text-lg font-medium">
          Create your workspace
        </h3>
      </div>
      <form
        onSubmit={handleSubmit((data) => {
          createWorkspace(data)
        })}
      >
        <div className="mx-auto flex space-x-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Your workspace name ..."
                disabled={isLoading}
              />
            )}
          />
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Create
          </Button>
        </div>
      </form>
      {holder}
    </div>
  )
}
