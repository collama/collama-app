import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import {
  GetFilterSettingByWorkspaceSlugInput,
  UpsertFilterInput,
} from "~/server/api/routers/filter-setting/dto/filter-setting.input"
import * as filterSettingService from "~/server/api/routers/filter-setting/filter-setting.service"

export const filterSettingTRPCRouter = createTRPCRouter({
  getFilterSettingByWorkspaceSlug: protectedProcedure
    .input(GetFilterSettingByWorkspaceSlugInput)
    .query(async ({ ctx, input }) =>
      filterSettingService.getFilterSettingByWorkspaceSlug(input, ctx.session)
    ),
})

export const upsertFilter = protectedProcedure
  .input(UpsertFilterInput)
  .mutation(async ({ input, ctx }) => filterSettingService.upsertFilter(input, ctx.session))
