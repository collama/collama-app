"use client"

import { z } from "zod"
import useZodForm from "~/common/form"
import { Controller, FormProvider } from "react-hook-form"
import { Button } from "~/ui/Button"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAction } from "~/trpc/client"
import { signUpAction } from "~/app/(public)/auth/sign-up/actions"
import { sleep } from "~/common/utils"
import { Input } from "~/ui/input"

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
})

type SubmitData = z.infer<typeof schema>

export default function SignUp() {
  const form = useZodForm({
    schema: schema,
    defaultValues: {
      email: "linh@gmail.com",
      password: "123",
      username: "linh",
    },
  })
  const router = useRouter()
  const session = useSession()
  const {
    mutate: signUpMutation,
    status: signUpStatus,
    data: signUpData,
  } = useAction(signUpAction)

  useEffect(() => {
    // Because have issue with SignInResponse in https://github.com/nextauthjs/next-auth/issues/7638
    if (session.status === "authenticated") {
      router.push("/")
    }
  }, [router, session.status])

  const onSubmit = async (data: SubmitData) => {
    signUpMutation(data)

    const resp = await signIn("credentials", {
      ...data,
      redirect: false,
    })

    if (resp?.ok) {
      await sleep(500)
      router.push("/")
    }
  }

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-center text-3xl font-bold">Register</h2>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto w-[600px] space-y-4">
            <div>
              <div>
                <span>UserName</span>
                <Controller
                  name="username"
                  render={({ field }) => <Input {...field} size="sm" />}
                />
              </div>
              <span>Email</span>
              <Controller
                name="email"
                render={({ field }) => (
                  <Input {...field} type="email" size="sm" />
                )}
              />
            </div>
            <div>
              <span>Password</span>
              <Controller
                name="password"
                render={({ field }) => (
                  <Input {...field} type="password" size="sm" />
                )}
              />
            </div>
            <section>
              <Button htmlType="submit" type="primary">
                Register
              </Button>
              <Link href="/auth/sign-in">Login</Link>
            </section>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
