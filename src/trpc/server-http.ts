"use server"

import { getUrl, transformer } from "./shared"
import { loggerLink } from "@trpc/client"
import { experimental_nextHttpLink } from "@trpc/next/app-dir/links/nextHttp"
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server"
import { cookies } from "next/headers"
import { type AppRouter } from "~/server/api/root"

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
          revalidate: 5,
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
