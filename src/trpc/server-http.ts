"use server"

import { getUrl, transformer } from "./shared"
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server"
import { cookies } from "next/headers"
import { type AppRouter } from "~/server/api/root"
import { experimental_nextHttpLink } from "@trpc/next/app-dir/links/nextHttp"
import { loggerLink } from "@trpc/client"

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        experimental_nextHttpLink({
          batch: true,
          url: getUrl(),
          headers() {
            return {
              cookie: cookies().toString(),
              "x-trpc-source": "rsc-http",
            }
          },
        }),
      ],
    }
  },
})
