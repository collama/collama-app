"use server"

import { createAction } from "~/server/api/trpc"
import { inviteMemberToTeam } from "~/server/api/routers/team"

export const inviteAction = createAction(inviteMemberToTeam)
