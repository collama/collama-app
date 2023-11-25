import type { ChatRole, Message } from "@prisma/client"
import { type INTERNAL_Snapshot, proxy } from "valtio"
import { useSnapshot } from "valtio/react"
import { type Parameter } from "~/components/Parameters"
import { type Variable } from "~/components/VariablesSection/contants"

export type Snapshot<T> = INTERNAL_Snapshot<T>

interface TaskStore {
  templates: Message[]
  variables: Variable[]
  parameter: Parameter
}

const defaultParameter: Parameter = {
  model: "",
  temperature: 0,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxTokens: 0,
  topP: 0,
  stopSequences: [],
  extra: {},
}

const init: TaskStore = {
  templates: [],
  variables: [],
  parameter: defaultParameter,
}

export const taskStore = proxy<TaskStore>(init)

export const useTemplatesActions = () => ({
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

export const useVariablesActions = () => ({
  append: (value: Variable[]) => {
    taskStore.variables = [...taskStore.variables, ...value]
  },
  updateContent: (index: number, value: string) => {
    const variable = taskStore.variables[index]

    if (variable) {
      variable.value = value
    }
  },
})

export const useParameterActions = () => ({
  append: (value: Parameter) => {
    taskStore.parameter = value
  },
  updateParameter: <T extends keyof Parameter>(key: T, value: Parameter[T]) => {
    taskStore.parameter[key] = value
  },
  updateModel: (value: string) => {
    taskStore.parameter.model = value
  }
})

export const useTemplates = () => useSnapshot(taskStore).templates
export const useVariables = () => useSnapshot(taskStore).variables
export const useParameter = () => useSnapshot(taskStore).parameter
