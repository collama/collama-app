"use client"

import { PageProps } from "~/common/types/props"
import { z } from "zod"
import { zId } from "~/common/validation"
import { useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { FormProvider } from "react-hook-form"
import { useRouter } from "next/navigation"
import { renameWorkspaceAction } from "~/app/(protected)/[workspace]/settings/actions"

interface Props {
  workspace: string
}

const schema = z.object({
  newName: zId,
})

export default function Settings({ params }: PageProps<Props>) {
  const router = useRouter()
  const mutation = useAction(renameWorkspaceAction)
  const form = useZodForm({
    schema,
  })

  return (
    <div>
      <h1>Create new task</h1>
      <div>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              mutation.mutate({
                oldName: params.workspace,
                newName: data.newName,
              })
              router.push(`/${data.newName}/settings`)
            })}
          >
            <div>
              <label htmlFor="create-workspace-name">New name</label>
              <input
                id="create-workspace-name"
                className="border"
                type="text"
                {...form.register("newName")}
              />
            </div>
            <button type="submit">Update</button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
