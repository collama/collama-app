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
import { useNotification } from "~/ui/Notification"
import cx from "classnames"

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
  username: z.string(),
})

type SubmitData = z.infer<typeof schema>

export default function SignUp() {
  const { control, handleSubmit } = useZodForm({
    schema: schema,
    defaultValues: {
      email: "linh@gmail.com",
      password: "123",
      username: "linh",
    },
  })
  const router = useRouter()
  const session = useSession()
  const [notice, holder] = useNotification({
    placement: "topRight",
  })
  const { mutate: signUpMutation, status: signUpStatus } =
    useAction(signUpAction)

  const signUploading = signUpStatus === "loading"

  useEffect(() => {
    // Because have issue with SignInResponse in https://github.com/nextauthjs/next-auth/issues/7638
    if (session.status === "authenticated") {
      router.push("/")
    }
  }, [router, session.status])

  useEffect(() => {
    if (signUpStatus === "error") {
      notice.open({
        content: {
          message: "User has been already exited",
        },
        status: "error",
      })
    }
  }, [signUpStatus])

  const onSubmit = async (data: SubmitData) => {
    signUpMutation(data)

    if (signUpStatus === "success") {
      const resp = await signIn("credentials", {
        ...data,
        redirect: false,
      })

      if (resp?.error) {
        notice.open({
          content: {
            message: "Failed to sign in",
          },
          status: "error",
        })
      }
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
                  <span className="hover:underline font-medium">Login</span>
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
