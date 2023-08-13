import { Action, ConditionFn, Resource } from "@prisma/client"
import { type Grant, Role } from "~/server/extensions/rbac/types"

export const createTeamReaderFactory =
  (teamId: string) =>
  (userId: string): Grant[] => {
    return [
      {
        role: Role.TeamReader,
        resource: Resource.Team,
        action: Action.READ,
        attributes: ["*"],
        condition: {
          Fn: ConditionFn.EQUALS,
          args: {
            teamId,
            userId,
          },
        },
      },
    ]
  }

export const createTeamWriterFactory =
  (teamId: string) =>
  (userId: string): Grant[] => {
    const createTeamReader = createTeamReaderFactory(teamId)
    return [
      ...createTeamReader(userId),
      {
        role: Role.WorkspaceWriter,
        resource: Resource.Team,
        action: Action.CREATE,
        attributes: ["*"],
        condition: {
          Fn: ConditionFn.EQUALS,
          args: {
            teamId,
            userId,
          },
        },
      },
      {
        role: Role.WorkspaceWriter,
        resource: Resource.Team,
        action: Action.UPDATE,
        attributes: ["*"],
        condition: {
          Fn: ConditionFn.EQUALS,
          args: {
            teamId,
            userId,
          },
        },
      },
    ]
  }

export const createTeamOwnerFactory =
  (teamId: string) =>
  (userId: string): Grant[] => {
    const createTeamWriter = createTeamWriterFactory(teamId)
    return [
      ...createTeamWriter(userId),
      {
        role: Role.WorkspaceWriter,
        resource: Resource.Team,
        action: Action.DELETE,
        attributes: ["*"],
        condition: {
          Fn: ConditionFn.EQUALS,
          args: {
            teamId,
            userId,
          },
        },
      },
    ]
  }
