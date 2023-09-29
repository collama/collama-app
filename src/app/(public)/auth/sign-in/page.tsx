"use client"

import cx from "classnames"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, FormProvider } from "react-hook-form"
import { z } from "zod"
import useZodForm from "~/common/form"
import { Button } from "~/ui/Button"
import { Input } from "~/ui/Input"
import { useNotification } from "~/ui/Notification"

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
})
type SubmitData = z.infer<typeof schema>

export default function Login() {
  const form = useZodForm({
    schema: schema,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [notice, holder] = useNotification({
    placement: "topRight",
  })
  const session = useSession()

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  useEffect(() => {
    // Because have issue with SignInResponse in https://github.com/nextauthjs/next-auth/issues/7638
    if (session.status === "authenticated") {
      setLoading(false)
      router.push(callbackUrl)
    }
  }, [session.status])

  const onSubmit = async (data: SubmitData) => {
    setLoading(true)

    const resp = await signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl,
    })

    if (resp?.error) {
      setLoading(false)
      notice.open({
        content: {
          message: "Failed to sign in",
        },
        status: "error",
      })
    }
  }

  return (
    <div className={cx({ "pointer-events-none": loading })}>
      <div className="w-[560px] rounded-xl p-6 shadow-card">
        <div className="space-y-6 py-5">
          <h2 className="text-center text-3xl font-bold">Sign In to Collama</h2>
          <p className="text-center text-neutral-500">
            Welcome back please enter your detail!
          </p>
        </div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto mt-10 w-[480px]">
              <div className="flex h-[100px] flex-col items-center justify-between">
                <Controller
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Your_email@gmail.com"
                      disabled={loading}
                    />
                  )}
                />
                <Controller
                  name="password"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="password"
                      placeholder="Password"
                      disabled={loading}
                    />
                  )}
                />
              </div>
              <div className="mt-10">
                <Button
                  size="lg"
                  block
                  htmlType="submit"
                  type="primary"
                  loading={loading}
                >
                  Sign In
                </Button>
                <div className="mt-4 text-center">
                  <span className="text-neutral-500">
                    {"Don't have an account? "}
                  </span>
                  <Link href="/auth/sign-up">
                    <span className="font-medium hover:underline">
                      Request now
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      {holder}
    </div>
  )
}
