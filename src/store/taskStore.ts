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
  append: (template: Message[]) => {
    taskStore.templates = [...taskStore.templates, ...template]
  },
  insert: (index: number, value: Message) => {
    taskStore.templates.splice(index, 0, value)
  },
  updateContent: (index: number, content: string) => {
    const template = taskStore.templates[index]

    if (template) {
      template.content = content
    }
  },
  updateRole: (index: number, role: ChatRole) => {
    const template = taskStore.templates[index]

    if (template) {
      template.role = role
    }
  },
  remove: (index: number) => {
    taskStore.templates.splice(index, 1)
  },
})

export const useTaskVariablesActions = () => ({
  append: (value: Variable[]) => {
    taskStore.variables = [...taskStore.variables, ...value]
  },
  updateVariableContent: (index: number, value: string) => {
    const variable = taskStore.variables[index]

    if (variable) {
      variable.value = value
    }
  },
})

export const useTaskStoreTemplates = () => useSnapshot(taskStore).templates
export const useTaskStoreTemplateByIndex = (index: number) =>
  useSnapshot(taskStore.templates)[index]
export const useTaskStoreVariables = () => useSnapshot(taskStore).variables
