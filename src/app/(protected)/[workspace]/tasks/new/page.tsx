"use client"

import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { Controller } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import type { PageProps } from "~/common/types/props"
import { zId } from "~/common/validation"
import { TipTap } from "~/ui/RichText"
import { useState } from "react"
import { createTaskAction } from "~/app/(protected)/[workspace]/tasks/new/actionts"
import { type JSONContent } from "@tiptap/react"
import urlJoin from "url-join"
import { Input } from "~/ui/Input"

const schema = z.object({
  name: zId,
  description: z.string().nullable(),
  prompt: z.string().optional(),
})

interface NewTaskPageProps {
  workspace: string
  team: string
}

export default function NewTaskPage({ params }: PageProps<NewTaskPageProps>) {
  const router = useRouter()
  const mutation = useAction(createTaskAction)
  const { handleSubmit, control } = useZodForm({
    schema,
  })
  const [prompt, setPrompt] = useState<JSONContent | null>(null)

  return (
    <div>
      <h1>Create new task</h1>
      <div>
        <form
          onSubmit={handleSubmit((data) => {
            mutation.mutate({
              name: data.name,
              description: data.description,
              prompt: JSON.stringify(prompt),
              workspaceName: params.workspace,
            })
            router.push(urlJoin("/", params.workspace, "tasks"))
          })}
        >
          <div>
            <label htmlFor="create-task-name">Name</label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => <Input {...field} />}
            />
            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <Input {...field} placeholder="Description" />
              )}
            />
          </div>
          <div>
            <label htmlFor="create-task-prompt">Prompt</label>
            <TipTap onChange={(editor) => setPrompt(editor)} />
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  )
}
