"use server"

import { inviteMemberToTeam } from "~/server/api/routers/team"
import { createAction } from "~/server/api/trpc"

export const inviteMemberToTeamAction = createAction(inviteMemberToTeam)
