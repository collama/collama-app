"use client"

import { IconEye, IconEyeOff } from "@tabler/icons-react"
import cx from "classnames"
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useState,
} from "react"
import type { ControllerRenderProps } from "react-hook-form"

type OverdriveProps = "size" | "prefix"

type InputSize = "base" | "sm"

const INPUT_SIZE: Record<InputSize, string> = {
  base: "text-base",
  sm: "text-sm",
}

interface CustomProps
  extends Omit<InputHTMLAttributes<unknown>, OverdriveProps> {
  size?: InputSize
  prefix?: ReactNode
  suffix?: ReactNode
}

type InputProps = CustomProps & Partial<ControllerRenderProps>

export const Input = forwardRef<HTMLInputElement | null, InputProps>(
  function Input(
    { className, type = "text", size = "base", suffix, prefix, ...props },
    ref
  ) {
    const { disabled } = props
    const [isShowPassword, setIsShowPassword] = useState(false)

    const classes = cx(
      "w-full rounded-lg px-3 py-1 outline-0 border border-gray-300 focus:border-violet-500",
      INPUT_SIZE[size],
      { "bg-gray-100 text-gray-300 cursor-not-allowed": disabled },
      className
    )

    const showPassword = () => setIsShowPassword(!isShowPassword)

    if (type === "password") {
      return renderPrefixSuffix({
        suffix,
        type,
        classes,
        isShowPassword,
        showPassword,
        ...props,
      })
    }

    return <input {...props} type={type} ref={ref} className={classes} />
  }
)

const renderPrefixSuffix = ({
  suffix,
  isShowPassword,
  showPassword,
  classes,
  ...props
}: Omit<InputProps, "prefix" | "size"> & {
  classes: string
  isShowPassword?: boolean
  showPassword?: () => void
}) => {
  return (
    <span
      className={cx(
        "w-full",
        classes,
        "inline-flex focus-within:border-violet-500"
      )}
    >
      <input
        {...props}
        type={isShowPassword ? "text" : "password"}
        className="w-full border-0 outline-0 ring-0"
      />
      {renderSuffix({ suffix, isShowPassword, showPassword })}
    </span>
  )
}
const renderSuffix = ({
  suffix,
  isShowPassword,
  showPassword,
}: {
  suffix?: ReactNode
  isShowPassword?: boolean
  showPassword?: () => void
}) => {
  if (!!showPassword) {
    return (
      <span onClick={showPassword} className="text-neutral-500">
        {isShowPassword ? <IconEye /> : <IconEyeOff />}
      </span>
    )
  }

  return suffix && <span>{suffix}</span>
}
