import { createPaginator } from "prisma-extension-pagination"

const paginate = createPaginator({})

export const pagination = {
  model: {
    task: {
      paginate,
    },
  },
}
