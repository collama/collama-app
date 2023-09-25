import { createTRPCRouter } from "~/server/api/trpc"
import { workspaceRouter } from "~/server/api/routers/workspace"
import { apiKeyRouter } from "~/server/api/routers/api-key"
import { teamRouter } from "~/server/api/routers/team"
import { filterSettingRouter } from "~/server/api/routers/filter-setting"
import { taskTRPCRouter } from "~/server/api/routers/task/task.router"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  task: taskTRPCRouter,
  workspace: workspaceRouter,
  team: teamRouter,
  apiKey: apiKeyRouter,
  filterSetting: filterSettingRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
