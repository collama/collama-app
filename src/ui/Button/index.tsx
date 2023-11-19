import type { PropsWithChildren, ReactNode } from "react"
import { forwardRef } from "react"
import { cl } from "~/common/utils"
import { Spin } from "~/ui/Spinner"

type ButtonType = "primary" | "default" | "text"
type ButtonSize = "sm" | "base" | "lg" | "xl"

interface ButtonProps extends PropsWithChildren {
  block?: boolean
  className?: string
  type?: ButtonType
  ghost?: boolean
  disable?: boolean
  loading?: boolean
  onClick?: () => void
  htmlType?: HTMLButtonElement["type"]
  size?: ButtonSize
  prefix?: ReactNode
}

const BASE_SIZE: Record<ButtonSize, string> = {
  sm: "text-sm py-0 px-2",
  base: "text-base px-2 py-1",
  lg: "text-lg py-3",
  xl: "text-xl py-5",
}

const BUTTON_TYPE: Record<ButtonType, string> = {
  default: "border-stone-300 hover:text-neutral-500 hover:border-stone-400",
  primary:
    "bg-violet-500 border-violet-500 text-white shadow-sm hover:opacity-90",
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
      loading,
      onClick,
      children,
      htmlType = "button",
      size = "base",
      prefix,
    },
    ref
  ) {
    const classes = cl(
      "relative inline-block text-neutral-400 touch-none text-neutral-500 select-none whitespace-nowrap rounded-lg border border-solid bg-transparent bg-none text-center font-normal leading-5 outline-0 transition-all",
      BUTTON_TYPE[type],
      BASE_SIZE[size],
      { "w-full block": block },
      { "bg-transparent": ghost },
      {
        "text-violet-700 hover:text-violet-800 font-medium ":
          ghost && type === "primary",
      },
      { "opacity-70 hover:!opacity-70": loading },
      {
        "cursor-not-allowed border-stone-300 bg-gray-200 text-gray-400 hover:!border-stone-300 hover:!bg-gray-200 hover:!text-gray-400":
          disable,
      },
      className
    )

    const renderChild = () => {
      return <span>{children}</span>
    }

    const renderLoading = () => {
      if (loading)
        return <Spin className={cl({ "text-white": type === "primary" })} />

      if (prefix)
        return (
          <span
            className={cl(
              "inline-block mr-1 align-middle",
              BUTTON_TYPE[type],
              { "bg-transparent": ghost },
              {
                "text-violet-700 hover:text-violet-800 font-medium ":
                  ghost && type === "primary",
              }
            )}
          >
            {prefix}
          </span>
        )

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
