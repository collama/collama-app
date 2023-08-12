"use client"

import { api, useAction } from "~/trpc/client"
import useAwaited from "~/hooks/useAwaited"
import Loading from "~/ui/loading"
import {
  removeMemberAction,
  updateMemberRoleAction,
} from "~/app/(protected)/[workspace]/actions"
import { useEffect } from "react"
import { Role } from "@prisma/client"
import { produce } from "immer"

interface Props {
  workspaceName: string
}

export const Members = (props: Props) => {
  const removeMemberMutation = useAction(removeMemberAction)
  const updateMemberRoleMutation = useAction(updateMemberRoleAction)
  const {
    data: members,
    loading,
    setData: setMembers,
  } = useAwaited(
    api.workspace.getMembers.query({
      workspaceName: props.workspaceName,
    })
  )

  useEffect(() => {
    if (removeMemberMutation.status === "success") {
      alert("Removed")
    }
  }, [removeMemberMutation.status])

  useEffect(() => {
    if (removeMemberMutation.status === "error" && removeMemberMutation.error) {
      console.log(removeMemberMutation.error)
    }
  }, [removeMemberMutation.error, removeMemberMutation.status])

  if (loading) {
    return <Loading />
  }

  if (!members) {
    return <div>Empty</div>
  }

  return (
    <ul>
      {members.map((member) => (
        <li key={member.id}>
          <span>
            {member.user.email} - {member.status}
          </span>
          <span> - </span>
          <select
            name="role"
            value={member.role}
            onChange={(e) => {
              const id = member.id
              const newRole = e.target.value as Role
              setMembers((prevState) =>
                produce(prevState, (draft) => {
                  const member = draft!.find((o) => o.id === id)
                  if (member) {
                    member.role = newRole
                  }
                })
              )
              updateMemberRoleMutation.mutate({
                id: member.id,
                role: e.target.value as Role,
              })
            }}
          >
            <option value={Role.Reader}>{Role.Reader}</option>
            <option value={Role.Writer}>{Role.Writer}</option>
            <option value={Role.Owner}>{Role.Owner}</option>
          </select>
          <div className="inline">
            <button
              className="border bg-gray-400"
              onClick={() => {
                removeMemberMutation.mutate({
                  id: member.id,
                })
              }}
            >
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
