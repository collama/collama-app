import { FC, PropsWithChildren } from "react"
import cx from "classnames"

type ButtonType = "primary" | "default"
interface ButtonProps extends PropsWithChildren {
  block?: boolean
  classNames?: string
  type?: ButtonType
  ghost?: boolean
  disable?: boolean
  icon?: any
  loading?: boolean
  onClick?: () => void
}

const BASE_SIZE = "text-base h-10 py-1.5 px-4 rounded-lg"

const BUTTON_TYPE: Record<ButtonType, string> = {
  default: "bg-white border-stone-300 shadow-sm hover:text-violet-500",
  primary: "bg-violet-500 text-white shadow-sm hover:opacity-90",
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
}) => {
  return (
    <button
      onClick={onClick}
      className={cx(
        "outline-0 relative inline-block text-center whitespace-nowrap font-normal bg-none bg-transparent border border-solid border-transparent transition-all touch-none select-none leading-6",
        BASE_SIZE,
        BUTTON_TYPE[type]
      )}
    >
      <span>{children}</span>
    </button>
  )
}
