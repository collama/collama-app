"use server"

import { createAction } from "~/server/api/trpc"
import { createTeam } from "~/server/api/routers/team"

export const createTeamAction = createAction(createTeam)
