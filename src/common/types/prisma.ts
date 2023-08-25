import { type Prisma } from "@prisma/client"

export type TaskIncludeOwner = Prisma.TaskGetPayload<{
  include: { owner: true }
}>
