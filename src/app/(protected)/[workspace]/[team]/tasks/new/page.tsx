"use client"

import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { FormProvider } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import type { PageProps } from "~/common/types/props"
import { zId } from "~/common/validation"
import { createTaskAction } from "~/app/(protected)/[workspace]/[team]/tasks/new/actionts"
import { TipTap } from "~/ui/RichText"
import { useState } from "react"
import { type Editor } from "@tiptap/core"

const schema = z.object({
  name: zId,
  prompt: z.string().optional(),
})

interface NewTaskPageProps {
  workspace: string
  team: string
}

export default function NewTaskPage({ params }: PageProps<NewTaskPageProps>) {
  const router = useRouter()
  const mutation = useAction(createTaskAction)
  const form = useZodForm({
    schema,
  })
  const [prompt, setPrompt] = useState<Editor | null>(null)

  return (
    <div>
      <h1>Create new task</h1>
      <div>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              mutation.mutate({
                name: data.name,
                prompt: JSON.stringify(prompt?.getJSON()),
              })
              router.push(`${params.workspace}/${params.team}`)
            })}
          >
            <div>
              <label htmlFor="create-task-name">Name</label>
              <input
                id="create-task-name"
                className="border"
                type="text"
                {...form.register("name")}
              />
            </div>
            <div>
              <label htmlFor="create-task-prompt">Prompt</label>
              <TipTap setPrompt={(editor) => setPrompt(editor)} />
            </div>
            <button type="submit">Create</button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
