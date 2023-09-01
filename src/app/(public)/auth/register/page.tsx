"use client"

import { z } from "zod"
import useZodForm from "~/common/form"
import { Controller, FormProvider } from "react-hook-form"
import { Input } from "~/ui/Input"
import { Button } from "~/ui/Button"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { type User } from "@prisma/client"

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
})

type SubmitData = z.infer<typeof schema>

export default function SignUp() {
  const form = useZodForm({ schema: schema })
  const router = useRouter()
  const session = useSession()

  useEffect(() => {
    // Because have issue with SignInResponse in https://github.com/nextauthjs/next-auth/issues/7638
    if (session.status === "authenticated") {
      router.push("/")
    }
  }, [router, session.status])

  const login = async (user: User) => {
    await signIn("credentials", { email: user.email, password: user.password })
  }

  const onSubmit = (data: SubmitData) => {
    try {
      // TODO(linh): register user by tprc and pass reps to login
      // login(resp)
    } catch (e) {
      console.error(e)
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
              <Link href="/auth/login">Login</Link>
            </section>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
