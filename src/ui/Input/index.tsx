import { forwardRef, type InputHTMLAttributes } from "react"
import cx from "classnames"
import type { ControllerRenderProps } from "react-hook-form"

type OverdriveProps = "size"

type InputType = "text" | "number"
type InputSize = "base" | "sm"

const INPUT_SIZE: Record<InputSize, string> = {
  base: "text-base",
  sm: "text-sm",
}

interface CustomProps
  extends Omit<InputHTMLAttributes<unknown>, OverdriveProps> {
  type?: InputType
  size?: InputSize
}

type InputProps = CustomProps & Partial<ControllerRenderProps>

export const Input = forwardRef<HTMLInputElement | null, InputProps>(
  function Input({ className, type = "text", size = "base", ...props }, ref) {
    return (
      <input
        {...props}
        type={type}
        ref={ref}
        className={cx(
          "rounded-lg px-3 py-1 outline outline-1",
          INPUT_SIZE[size],
          className
        )}
      />
    )
  }
)
