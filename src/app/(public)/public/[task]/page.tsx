"use client"

import useAwaited from "~/hooks/useAwaited"
import { api, useAction } from "~/trpc/client"
import useZodForm from "~/common/form"
import { z } from "zod"
import { Controller, FormProvider } from "react-hook-form"
import { Input } from "~/ui/Input"
import { Button } from "~/ui/Button"
import { executeTaskAction } from "~/app/(protected)/[workspace]/tasks/new/actionts"
import { capitalizeFirstLetter } from "~/common/utils"
import { Spin } from "~/ui/Spinner"
import type { PageProps } from "~/common/types/props"
import { useEffect, useState } from "react"

type Props = {
  task: string
}

export default function Page({ params }: PageProps<Props>) {
  return <h1>Hello</h1>
}
