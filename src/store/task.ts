import type { ChatRole, Message } from "@prisma/client"
import { type INTERNAL_Snapshot, proxy } from "valtio"
import { useSnapshot } from "valtio/react"
import { type Variable } from "~/components/VariablesSection/contants"

export type Snapshot<T> = INTERNAL_Snapshot<T>

interface TaskStore {
  templates: Message[]
  variables: Variable[]
}

const init: TaskStore = {
  templates: [],
  variables: [],
}

export const taskStore = proxy<TaskStore>(init)

export const useTaskStoreTemplatesActions = () => ({
  append: (template: Message) => {
    taskStore.templates.push(template)
  },
  insert: (index: number, template: Message) => {
    if (taskStore.templates[index] !== undefined) {
      taskStore.templates.splice(index, 0, template)
    }
  },
  updateContent: (index: number, content: string) => {
    if (taskStore.templates[index] !== undefined) {
      taskStore.templates[index]!.content = content
    }
  },
  updateRole: (index: number, role: ChatRole) => {
    if (taskStore.templates[index] !== undefined) {
      taskStore.templates[index]!.role = role
    }
  },
  remove: (index: number) => {
    if (taskStore.templates[index] !== undefined) {
      taskStore.templates.splice(index, 1)
    }
  },
})

export const useTaskVariablesActions = () => ({
  insertVariables: (vars: Variable[]) => {
    taskStore.variables = vars
  },
  updateVariableValue: (index: number, value: string) => {
    if (taskStore.templates[index] !== undefined) {
      taskStore.variables[index]!.value = value
    }
  },
})

export const useTaskStoreTemplates = () => useSnapshot(taskStore.templates)
export const useTaskStoreTemplateByIndex = (index: number) =>
  useSnapshot(taskStore.templates)[index]
export const useTaskStoreVariables = () => useSnapshot(taskStore.variables)
