import { type Action, type Resource } from "@prisma/client"
import { Query } from "role-acl/lib/src/core/Query"
import { AccessControl, type ICondition, type Permission } from "role-acl"
import { Role } from "~/server/extensions/rbac/types"

export class ExtendedQuery<T> extends Query {
  context(context: T): ExtendedQuery<T> {
    return super.context(context)
  }

  execute(action: Action): ExtendedQuery<T> {
    return super.execute(action)
  }

  resource(resource: Resource): ExtendedQuery<T> {
    return super.resource(resource)
  }

  skipConditions(value: boolean): Query {
    return super.skipConditions(value)
  }

  on(
    resource: Resource,
    skipConditions?: boolean
  ): Permission | Promise<Permission> {
    return super.on(resource, skipConditions)
  }
}

export class ExtendedAccessControl<TData> extends AccessControl {
  can(role: Role): ExtendedQuery<TData> {
    return super.can(role)
  }

  hasRole(role: Role): boolean {
    return super.hasRole(role)
  }

  extendRole(
    roles: Role | Role[],
    extenderRoles: Role | Role[],
    condition?: ICondition
  ): AccessControl {
    return super.extendRole(roles, extenderRoles, condition)
  }

  extendRoleSync(
    roles: Role | Role[],
    extenderRoles: Role | Role[],
    condition?: ICondition
  ): AccessControl {
    return super.extendRoleSync(roles, extenderRoles, condition)
  }

  removeRoles(roles: Role | Role[]): AccessControl {
    return super.removeRoles(roles)
  }
}
