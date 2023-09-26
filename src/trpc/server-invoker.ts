"use server"

import { loggerLink } from "@trpc/client"
import { experimental_nextCacheLink } from "@trpc/next/app-dir/links/nextCache"
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server"
import { cookies } from "next/headers"
import SuperJSON from "superjson"
import { appRouter } from "~/server/api/root"
import { prisma } from "~/server/db"
import { getAuthSession } from "~/libs/auth"

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = experimental_createTRPCNextAppDirServer<typeof appRouter>({
  config() {
    return {
      transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        experimental_nextCacheLink({
          // requests are cached for 5 seconds
          revalidate: 1,
          router: appRouter,
          createContext: async () => {
            const session = await getAuthSession()

            return {
              session,
              prisma,
              headers: {
                cookie: cookies().toString(),
                "x-trpc-source": "rsc-invoker",
              } as never,
            }
          },
        }),
      ],
    }
  },
})
