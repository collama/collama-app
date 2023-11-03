"use client"

import { type FC, useEffect } from "react"
import { VariablesSection } from "~/components/VariablesSection"
import { transformTemplates2Variables } from "~/services/richtext"
import {
  useTaskStoreTemplates,
  useTaskVariablesActions,
} from "~/store/taskStore"

export const Variables: FC = () => {
  const templates = useTaskStoreTemplates()
  const { updateVariableContent, append } = useTaskVariablesActions()
  const data = transformTemplates2Variables(templates)

  useEffect(() => {
    append(data)
  }, [data.length])

  return (
    <>
      <div>Input</div>
      <VariablesSection data={data} updateContent={updateVariableContent} />
    </>
  )
}
