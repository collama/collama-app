import { createTRPCRouter } from "~/server/api/trpc"
import { userRouter } from "~/server/api/routers/user"
import { teamRouter } from "~/server/api/routers/team"
import { taskRouter } from "~/server/api/routers/task"
import { workspaceRouter } from "~/server/api/routers/workspace"
import { apiKeyRouter } from "~/server/api/routers/api-key"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  team: teamRouter,
  task: taskRouter,
  workspace: workspaceRouter,
  apiKey: apiKeyRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
