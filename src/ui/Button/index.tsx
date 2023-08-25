import type { PropsWithChildren, ReactNode } from "react"
import { forwardRef } from "react"
import cx from "classnames"

type ButtonType = "primary" | "default" | "text"
type ButtonSize = "base" | "sm"

interface ButtonProps extends PropsWithChildren {
  block?: boolean
  classNames?: string
  type?: ButtonType
  ghost?: boolean
  disable?: boolean
  icon?: ReactNode
  loading?: boolean
  onClick?: () => void
  htmlType?: HTMLButtonElement["type"]
  size?: ButtonSize
}

const BASE_SIZE: Record<ButtonSize, string> = {
  base: "text-base",
  sm: "text-sm",
}

const BUTTON_TYPE: Record<ButtonType, string> = {
  default:
    "bg-white border-stone-300 shadow-sm hover:text-violet-500 hover:border-violet-500",
  primary: "bg-violet-500 text-white shadow-sm hover:opacity-90",
  text: "border-0 hover:bg-gray-100 ",
}

export const Button = forwardRef<HTMLButtonElement | null, ButtonProps>(
  function Button(
    {
      block,
      classNames,
      type = "default",
      ghost,
      disable,
      icon,
      loading,
      onClick,
      children,
      htmlType = "button",
      size = "base",
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        onClick={onClick}
        type={htmlType}
        className={cx(
          "relative inline-block touch-none select-none whitespace-nowrap rounded-lg border border-solid bg-transparent bg-none px-2 py-1 text-center font-normal leading-5 outline-0  transition-all",
          BASE_SIZE[size],
          BUTTON_TYPE[type],
          classNames,
          {
            "cursor-not-allowed border-stone-300 bg-gray-200 text-gray-400 hover:border-stone-300 hover:bg-gray-200 hover:text-gray-400":
              disable,
          }
        )}
        disabled={disable}
      >
        <span>{children}</span>
      </button>
    )
  }
)
