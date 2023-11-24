import type { TaskRevision } from "@prisma/client"
import { Suspense } from "react"
import { Executes } from "~/app/(protected)/[workspace]/[task]/components/Executes"
import { Templates } from "~/app/(protected)/[workspace]/[task]/components/Templates"
import { Variables } from "~/app/(protected)/[workspace]/[task]/components/Variables"
import type { PageProps } from "~/common/types/props"
import { Parameters } from "~/components/Parameters"
import { api } from "~/trpc/server-http"
import { Disclosure } from "~/ui/Disclosure"
import { Resize } from "~/ui/Resize"
import Loading from "~/ui/loading"

interface TaskProps {
  task: string
  workspace: string
}
interface TaskSearchProps {
  version: string
}

export interface TaskRevisionProps {
  taskRevision: TaskRevision
}

export default async function TaskPage({
  params,
  searchParams,
}: PageProps<TaskProps, TaskSearchProps>) {
  const taskRevision = await api.taskRevision.getByIdAndVersion.query({
    workspaceSlug: params.workspace,
    taskSlug: params.task,
    version: searchParams.version,
  })

  if (!taskRevision) {
    return <div>Invalid task</div>
  }

  return (
    <Suspense fallback={<Loading />}>
      <Resize
        firstElement={<TemplateAndVariable taskRevision={taskRevision} />}
        secondElement={<Executes taskRevision={taskRevision} />}
        showTitle="Config"
      />
    </Suspense>
  )
}

const TemplateAndVariable = ({ taskRevision }: TaskRevisionProps) => {
  return (
    <div>
      <Disclosure
        items={[
          {
            label: "Parameters",
            children: <Parameters taskRevision={taskRevision} />,
          },
        ]}
      />
      {/*<div className="border-b" />*/}
      {/*<Disclosure*/}
      {/*  items={[*/}
      {/*    {*/}
      {/*      label: "Chat templates",*/}
      {/*      children: <Templates taskRevision={taskRevision} />,*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*/>*/}
      {/*<div className="border-b" />*/}
      {/*<Disclosure*/}
      {/*  items={[*/}
      {/*    {*/}
      {/*      label: "Variable inputs",*/}
      {/*      children: <Variables />,*/}
      {/*    },*/}
      {/*  ]}*/}
      {/*/>*/}
    </div>
  )
}
