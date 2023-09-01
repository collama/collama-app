"use client"

import { z } from "zod"
import useZodForm from "~/common/form"
import { Controller, FormProvider } from "react-hook-form"
import { Button } from "~/ui/Button"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { sleep } from "~/common/utils"
import { Input } from "~/ui/input"

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
})
type SubmitData = z.infer<typeof schema>

export default function Login() {
  const form = useZodForm({
    schema: schema,
    defaultValues: {
      email: "linh@gmail.com",
      password: "123",
    },
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const onSubmit = async (data: SubmitData) => {
    setLoading(true)
    setError(null)

    const resp = await signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl,
    })

    if (resp?.ok) {
      await sleep(500)
      setLoading(false)
      router.push(callbackUrl)
    }

    if (resp?.error) {
      setLoading(false)
      setError(resp.error)
    }
  }

  if (error) {
    return <span>Error: {error}</span>
  }

  // if (loading) {
  //   return <Loading />
  // }

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
              <Link href="/auth/sign-up">Register</Link>
            </section>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
