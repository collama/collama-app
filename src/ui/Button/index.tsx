import cx from "classnames"
import type { PropsWithChildren, ReactNode } from "react"
import { forwardRef } from "react"
import { Spin } from "~/ui/Spinner"

type ButtonType = "primary" | "default" | "text"
type ButtonSize = "sm" | "base" | "lg" | "xl"

interface ButtonProps extends PropsWithChildren {
  block?: boolean
  className?: string
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
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg py-3",
  xl: "text-xl py-5",
}

const BUTTON_TYPE: Record<ButtonType, string> = {
  default:
    "bg-white border-stone-300 shadow-sm hover:text-violet-500 hover:border-violet-500",
  primary: "bg-violet-500 text-white shadow-sm hover:opacity-90",
  text: "border-0 hover:underline hover:text-opacity-90 hover:underline-offset-4 ",
}

export const Button = forwardRef<HTMLButtonElement | null, ButtonProps>(
  function Button(
    {
      block,
      className,
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
    const classes = cx(
      {
        "cursor-not-allowed border-stone-300 bg-gray-200 text-gray-400 hover:!border-stone-300 hover:!bg-gray-200 hover:!text-gray-400":
          disable,
      },
      className,
      BUTTON_TYPE[type],
      { "w-full block": block },
      BASE_SIZE[size],
      { "opacity-70 hover:!opacity-70": loading },
      "relative inline-block touch-none select-none whitespace-nowrap rounded-lg border border-solid bg-transparent bg-none px-2 py-1 text-center font-normal leading-5 outline-0  transition-all inline-flex items-center gap-x-3 justify-center"
    )

    const renderChild = () => {
      return <span>{children}</span>
    }

    const renderLoading = () => {
      if (loading)
        return <Spin className={cx({ "text-white": type === "primary" } )} />

      return null
    }

    return (
      <button
        ref={ref}
        onClick={onClick}
        type={htmlType}
        className={classes}
        disabled={disable || loading}
      >
        {renderLoading()}
        {renderChild()}
      </button>
    )
  }
)
