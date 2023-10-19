import { ChatRole } from "@prisma/client"
import { type INTERNAL_Snapshot, proxy } from "valtio"
import { useSnapshot } from "valtio/react"
import { type Template } from "~/components/PromptTemplates/contants"
import { type Variable } from "~/components/VariablesSection/contants"


export type Snapshot<T> = INTERNAL_Snapshot<T>

export type TaskTemplate = {
  id: string
} & Template

interface TaskStore {
  promptsTemplate: TaskTemplate[]
  variables: Variable[]
}

const init: TaskStore = {
  promptsTemplate: [],
  variables: [],
}

export const taskStore = proxy<TaskStore>(init)

export const useTaskStoreAction = () => ({
  insertTemplate: (template: TaskTemplate) => {
    taskStore.promptsTemplate.push(template)
  },
  updateTemplatePromptByIndex: (content: string, index: number) => {
    if (taskStore.promptsTemplate[index] !== undefined) {
      taskStore.promptsTemplate[index]!.content = content
    }
  },
  updateTemplateRoleByIndex: (role: ChatRole, index: number) => {
    if (taskStore.promptsTemplate[index] !== undefined) {
      taskStore.promptsTemplate[index]!.role = role
    }
  },
  removeTemplateByIndex: (index: number) => {
    if (taskStore.promptsTemplate[index] !== undefined) {
      taskStore.promptsTemplate.splice(index, 1)
    }
  },
  insertVariables: (vars: Variable[]) => {
    taskStore.variables = vars
  },
  updateVariableValue: (value: string, index: number) => {
    if (taskStore.promptsTemplate[index] !== undefined) {
      taskStore.variables[index]!.value = value
    }
  },
})

export const useTaskStorePrompts = () => useSnapshot(taskStore.promptsTemplate)
export const useTaskStoreTemplateByIndex = (index:number) => useSnapshot(taskStore.promptsTemplate)[index]
export const useTaskStoreVariables = () => useSnapshot(taskStore.variables)
