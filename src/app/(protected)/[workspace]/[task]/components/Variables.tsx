"use client"

import { FC } from "react"
import { useTaskStoreTemplates } from "~/store/task"


export const Variables: FC = () => {
  const test = useTaskStoreTemplates()

  console.log(test)

  return <></>
}
