import { Action, Condition } from "@prisma/client"

export enum Role {
  Admin = "admin",

  // for a specific workspace
  WorkspaceOwner = "workspace/owner",
  WorkspaceReader = "workspace/reader",
  WorkspaceWriter = "workspace/writer",

  // for a specific team
  TeamOwner = "team/owner",
  TeamReader = "team/reader",
  TeamWriter = "team/writer",

  // for a specific team
  TaskOwner = "task/owner",
  TaskReader = "task/reader",
  TaskWriter = "task/writer",
}

export interface Grant {
  role: string
  resource: string
  action: Action
  attributes: string[]
  condition?: Condition
}
