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

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
})
type SubmitData = z.infer<typeof schema>

export default function Login() {
  const form = useZodForm({ schema: schema })
  const router = useRouter()
  const session = useSession()
  console.log(session)

  useEffect(() => {
    // Because have issue with SignInResponse in https://github.com/nextauthjs/next-auth/issues/7638
    if (session.status === "authenticated") {
      router.push("/")
    }
  }, [router, session.status])

  const onSubmit = async (data: SubmitData) => {
    await signIn("credentials", { ...data, redirect: false })
  }

  return (
    <div>
      <div className="mb-10">
        <h2 className="text-center text-3xl font-bold">Login</h2>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mx-auto w-[600px] space-y-4">
            <div>
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
                Login
              </Button>
              <Link href="/auth/register">Register</Link>
            </section>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
