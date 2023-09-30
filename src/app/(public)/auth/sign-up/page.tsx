"use client"

import cx from "classnames"
import { signIn, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Controller } from "react-hook-form"
import { z } from "zod"
import { signUpAction } from "~/app/(public)/auth/sign-up/actions"
import useZodForm from "~/common/form"
import { useAction } from "~/trpc/client"
import { Button } from "~/ui/Button"
import { Input } from "~/ui/Input"
import { useNotification } from "~/ui/Notification"

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
})

type SubmitData = z.infer<typeof schema>

export default function Page() {
  const { control, handleSubmit } = useZodForm({
    schema: schema,
  })
  const router = useRouter()
  const session = useSession()
  const [notice, holder] = useNotification({
    placement: "topRight",
  })
  const {
    mutateAsync: signUpMutation,
    status: signUpStatus,
    error: signUpError,
  } = useAction(signUpAction)

  const signUploading = signUpStatus === "loading"

  useEffect(() => {
    // Because have issue with SignInResponse in https://github.com/nextauthjs/next-auth/issues/7638
    if (session.status === "authenticated") {
      router.push("/")
    }
  }, [router, session.status])

  useEffect(() => {
    if (signUpStatus === "error" && signUpError) {
      notice.open({
        content: {
          message: "User has been already exited",
          description: signUpError.message,
        },
        status: "error",
      })
    }
  }, [signUpStatus, signUpError])

  const onSubmit = async (data: SubmitData) => {
    try {
      await signUpMutation(data)

      const resp = await signIn("credentials", {
        ...data,
        redirect: false,
      })

      if (resp?.error) {
        return notice.open({
          content: {
            message: "Failed to sign in",
          },
          status: "error",
        })
      }
    } catch (e) {
      notice.open({
        content: {
          message: "Failed to sign in",
        },
        status: "error",
      })
    }
  }

  return (
    <div className={cx({ "pointer-events-none": signUploading })}>
      <div className="w-[560px] rounded-xl p-6 shadow-card">
        <div className="space-y-6 py-5">
          <h2 className="text-center text-3xl font-bold">
            Create your account
          </h2>
          <p className="text-center text-neutral-500">
            {"Hi there! Let's create your account."}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto mt-10 w-[480px]">
            <div className="flex h-[180px] w-full flex-col items-center justify-between">
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Your name"
                    disabled={signUploading}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Email address"
                    disabled={signUploading}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="password"
                    placeholder="Password"
                    disabled={signUploading}
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
                loading={signUploading}
              >
                Sign Up
              </Button>
              <div className="mt-4 text-center">
                <span className="text-neutral-500">
                  {"You already have an account? "}
                </span>
                <Link href="/auth/sign-in">
                  <span className="font-medium hover:underline">Login</span>
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
      {holder}
    </div>
  )
}
