"use server"

import { createAction } from "~/server/api/trpc"
import { inviteMemberToTeam } from "~/server/api/routers/team"

export const inviteMemberToTeamAction = createAction(inviteMemberToTeam)
