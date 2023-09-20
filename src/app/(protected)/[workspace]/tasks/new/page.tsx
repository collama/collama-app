"use client"

import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { Controller } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import type { PageProps } from "~/common/types/props"
import { zId } from "~/common/validation"
import { TipTap } from "~/ui/RichText"
import { useEffect, useState } from "react"
import { createTaskAction } from "~/app/(protected)/[workspace]/tasks/new/actionts"
import { type JSONContent } from "@tiptap/react"
import urlJoin from "url-join"
import { Input } from "~/ui/Input"
import { Button } from "~/ui/Button"
import { useNotification } from "~/ui/Notification"
import useAsyncEffect from "use-async-effect"
import { sleep } from "~/common/utils"
import cx from "classnames"

const schema = z.object({
  name: z.string().nonempty(),
  description: z.string().nullable(),
  prompt: z.string().optional(),
})

interface NewTaskPageProps {
  workspace: string
  team: string
}

export default function NewTaskPage({ params }: PageProps<NewTaskPageProps>) {
  const router = useRouter()
  const { mutate: createTask, status, error } = useAction(createTaskAction)
  const { handleSubmit, control } = useZodForm({
    schema,
  })
  const [prompt, setPrompt] = useState<JSONContent | null>(null)
  const [notice, holder] = useNotification()

  const loading = status === "loading"

  useEffect(() => {
    if (status === "error" && error) {
      notice.open({
        content: {
          message: "Failed to create task",
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
          message: "Create task is successfully",
        },
        status: "success",
      })

      await sleep(500)
      window.location.reload()
    }
  }, [status])

  return (
    <>
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Create new task</h2>
        </div>
        <div className="rounded-lg border p-5">
          <form
            onSubmit={handleSubmit((data) => {
              createTask({
                name: data.name,
                description: data.description,
                prompt: JSON.stringify(prompt),
                workspaceName: params.workspace,
              })
              router.push(urlJoin("/", params.workspace, "tasks"))
            })}
          >
            <div className="space-y-4">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Task name"
                    disabled={loading}
                  />
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Task description"
                    disabled={loading}
                  />
                )}
              />
              <div
                className={cx(
                  "rounded-lg border p-2 focus-within:border-violet-500",
                  {
                    "pointer-events-none border-gray-300 bg-gray-100 text-gray-300":
                      loading,
                  }
                )}
              >
                <label className="text-gray-400">Prompt</label>
                <div>
                  <TipTap onChange={(editor) => setPrompt(editor)} />
                </div>
              </div>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create
              </Button>
            </div>
          </form>
        </div>
      </div>
      {holder}
    </>
  )
}
