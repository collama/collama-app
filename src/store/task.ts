import { v4 } from "uuid"
import { proxy, subscribe } from "valtio"
import { INTERNAL_Snapshot } from "valtio"
import { useSnapshot } from "valtio/react"
import {
  DEFAULT_TEMPLATE,
  Template,
} from "~/components/PromptTemplates/contants"
import { Variable } from "~/components/VariablesSection/contants"

export type Snapshot<T> = INTERNAL_Snapshot<T>

type TaskTemplate = {
  id: string
} & Template

interface TaskStore {
  promptsTemplate: TaskTemplate[]
  variables: Variable[]
}

const init: TaskStore = {
  promptsTemplate: [{ ...DEFAULT_TEMPLATE, role: "system", id: v4() }],
  variables: [],
}

export const taskStore = proxy<TaskStore>(init)

export const useTaskStoreAction = () => ({
  insertTemplate: (template: TaskTemplate) => {
    taskStore.promptsTemplate.push(template)
  },
  updateTemplatePromptByIndex: (prompt: string, index: number) => {
    taskStore.promptsTemplate.forEach((item, i) => {
      if (i === index) {
        item.prompt = prompt
      }
    })
  },
  updateTemplateRoleByIndex: (role: string, index: number) => {
    taskStore.promptsTemplate.forEach((item, i) => {
      if (i === index) {
        item.role = role
      }
    })
  },
})

export const useTaskStorePrompts = () => useSnapshot(taskStore.promptsTemplate)
