import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";

const getByIdAndVersion = protectedProcedure.input()

export const taskTRPCRouter = createTRPCRouter({
  getByIdAndVersion
})
