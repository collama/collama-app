"use client"

import { useEffect, useState } from "react"
import { Controller, FormProvider } from "react-hook-form"
import { z } from "zod"
import { executeTaskAction } from "~/app/(protected)/[workspace]/tasks/new/actionts"
import useZodForm from "~/common/form"
import type { PageProps } from "~/common/types/props"
import { capitalizeFirstLetter } from "~/common/utils"
import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import { Button } from "~/ui/Button"
import { Input } from "~/ui/Input"
import { Spin } from "~/ui/Spinner"

type Props = {
  task: string
}

export default function Page({ params }: PageProps<Props>) {
  return <h1>Hello</h1>
}
