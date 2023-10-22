"use client"

import { useTaskStoreVariables } from "~/store/task"

export const Executes = () => {
  const variables = useTaskStoreVariables()
  console.log(variables)

  return <div>exe</div>
}
