"use client"

import { getUrl, transformer } from "./shared"
import { loggerLink } from "@trpc/client"
import {
  experimental_createActionHook,
  experimental_createTRPCNextAppDirClient,
  experimental_serverActionLink,
} from "@trpc/next/app-dir/client"
import { experimental_nextHttpLink } from "@trpc/next/app-dir/links/nextHttp"
import { type AppRouter } from "~/server/api/root"

export const api = experimental_createTRPCNextAppDirClient<AppRouter>({
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
              "x-trpc-source": "client",
            }
          },
        }),
      ],
    }
  },
})

export const useAction = experimental_createActionHook({
  links: [loggerLink(), experimental_serverActionLink()],
  transformer,
})

/** Export type helpers */
export * from "./shared"
