import { createTRPCRouter } from "~/server/api/trpc"
import { workspaceTRPCRouter } from "~/server/api/routers/workspace/workspace.router"
import { taskTRPCRouter } from "~/server/api/routers/task/task.router"
import { apiKeyTRPCRouter } from "~/server/api/routers/api-key/api-key.router"
import { filterSettingTRPCRouter } from "~/server/api/routers/filter-setting/filter-setting.router"
import { teamTRPCRouter } from "~/server/api/routers/team/team.router"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  task: taskTRPCRouter,
  workspace: workspaceTRPCRouter,
  team: teamTRPCRouter,
  apiKey: apiKeyTRPCRouter,
  filterSetting: filterSettingTRPCRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
