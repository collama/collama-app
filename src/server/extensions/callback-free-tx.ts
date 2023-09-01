import { Prisma } from "@prisma/client"

type FlatTransactionClient = Prisma.TransactionClient & {
  $commit: () => Promise<void>
  $rollback: () => Promise<void>
}

const ROLLBACK = {
  [Symbol.for("prisma.client.extension.rollback")]: true,
}

export const callbackFreeTx = Prisma.defineExtension((prisma) => {
  return prisma.$extends({
    client: {
      async $begin() {
        const prisma = Prisma.getExtensionContext(this)
        let setTxClient: (txClient: Prisma.TransactionClient) => void
        let commit: () => void
        let rollback: () => void

        const txClient = new Promise<Prisma.TransactionClient>((resolve) => {
          setTxClient = (txClient) => resolve(txClient)
        })

        const txPromise = new Promise((resolve, reject) => {
          commit = () => resolve(undefined)
          rollback = () => reject(ROLLBACK)
        })

        if (
          "$transaction" in prisma &&
          typeof prisma.$transaction === "function"
        ) {
          const tx = prisma.$transaction((txClient) => {
            setTxClient(txClient as unknown as Prisma.TransactionClient)

            return txPromise.catch((e) => {
              if (e === ROLLBACK) return
              throw e
            })
          })

          return new Proxy(await txClient, {
            get(target, prop) {
              if (prop === "$commit") {
                return () => {
                  commit()
                  return tx
                }
              }

              if (prop === "$rollback") {
                return () => {
                  rollback()
                  return tx
                }
              }

              return target[prop as keyof typeof target]
            },
          }) as FlatTransactionClient
        }

        throw new Error("Transactions are not supported by this client")
      },
    },
  })
})
