import { apiKeyTRPCRouter } from "~/server/api/routers/api-key/api-key.router"
import { filterSettingTRPCRouter } from "~/server/api/routers/filter-setting/filter-setting.router"
import { providerTRPCRouter } from "~/server/api/routers/provider/provider.router"
import { taskTRPCRouter } from "~/server/api/routers/task/task.router"
import { taskRevisionTRPCRouter } from "~/server/api/routers/taskRevision/taskRevision.router"
import { teamTRPCRouter } from "~/server/api/routers/team/team.router"
import { workspaceTRPCRouter } from "~/server/api/routers/workspace/workspace.router"
import { createTRPCRouter } from "~/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  task: taskTRPCRouter,
  taskRevision: taskRevisionTRPCRouter,
  workspace: workspaceTRPCRouter,
  team: teamTRPCRouter,
  apiKey: apiKeyTRPCRouter,
  filterSetting: filterSettingTRPCRouter,
  provider: providerTRPCRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
