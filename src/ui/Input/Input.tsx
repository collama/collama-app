import { IconCircleXFilled } from "@tabler/icons-react"
import { forwardRef, type ReactNode } from "react"
import { cl } from "~/common/utils"
import type { InputProps as CInputProps, InputRef } from "~/ui/Col-ui/Input"
import { Input as CInput } from "~/ui/Col-ui/Input"

type InputSize = "base" | "md" | "sm"

const INPUT_SIZE: Record<InputSize, string> = {
  base: "text-base",
  md: "text-md",
  sm: "text-sm",
}

export interface InputProps extends CInputProps {
  prefix?: ReactNode
  suffix?: ReactNode
  allowClear?: boolean
  size?: InputSize
  type?: "text" | "email" | "password"
  disabled?: boolean
  value?: string | number
}

export const Input = forwardRef<InputRef, InputProps>(function Input(
  {
    allowClear,
    size = "base",
    type = "text",
    disabled,
    className,
    ...restProps
  },
  ref
) {
  const renderClearIcon = () => {
    if (allowClear) {
      return {
        clearIcon: (
          <IconCircleXFilled className="h-4 w-4 text-neutral-400 opacity-50 hover:opacity-80 " />
        ),
      }
    }

    return false
  }

  const hasPrefixSuffix = (): boolean =>
    !!restProps.prefix || !!restProps.suffix || !!allowClear

  return (
    <CInput
      classNames={{
        input: cl(
          "w-full rounded-lg ",
          { "cursor-not-allowed bg-gray-100 text-gray-300": disabled },
          { "!px-0 py-0 text-black border-0 outline-0": hasPrefixSuffix() },
          INPUT_SIZE[size],
          "outline-0 border border-gray-300 focus:border-violet-500 px-3 py-1",
          className
        ),
        affixWrapper:
          "w-full rounded-lg outline-0 focus-within:border-violet-500 relative inline-flex min-w-0 py-1 px-3 border border-gray-300 transition-all",
        suffix: "flex items-center ps-1",
        prefix: "flex items-center ps-1",
      }}
      {...restProps}
      ref={ref}
      type={type}
      disabled={disabled}
      autoComplete={type === "password" ? "new-password" : "autoComplete"}
      allowClear={renderClearIcon()}
    />
  )
})
