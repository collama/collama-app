import type { FC, PropsWithChildren, ReactNode } from "react"
import cx from "classnames"

type ButtonType = "primary" | "default" | "text"

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
}

const BASE_SIZE = "text-base h-10 py-1.5 px-2.5 rounded-lg"

const BUTTON_TYPE: Record<ButtonType, string> = {
  default:
    "bg-white border-stone-300 shadow-sm hover:text-violet-500 hover:border-violet-500",
  primary: "bg-violet-500 text-white shadow-sm hover:opacity-90",
  text: "border-0 hover:bg-gray-100 ",
}

export const Button: FC<ButtonProps> = ({
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
}) => {
  return (
    <button
      onClick={onClick}
      type={htmlType}
      className={cx(
        "outline-0 relative inline-block text-center whitespace-nowrap font-normal bg-none bg-transparent border border-solid transition-all touch-none select-none leading-6",
        BASE_SIZE,
        BUTTON_TYPE[type]
      )}
    >
      <span>{children}</span>
    </button>
  )
}
