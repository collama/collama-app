import { IconX } from "@tabler/icons-react"
import cx from "classnames"
import type { FC, PropsWithChildren, ReactNode } from "react"

type TagColor = "green" | "red" | "normal"
interface TagProps extends PropsWithChildren {
  color?: TagColor
  closeIcon?: ReactNode
  onClose?: () => void
  icon?: ReactNode
  classname?: string
}

const ColorStyle: Record<TagColor, string> = {
  normal: "bg-stone-100",
  red: "bg-red-50 border-red-200 text-red-400",
  green: "bg-green-50 border-green-200 text-green-400",
}

export const Tag: FC<TagProps> = ({
  children,
  onClose,
  closeIcon,
  classname,
  color = "normal",
}) => {
  const mergeCloseIcon = () => {
    if (closeIcon === false) return

    return closeIcon ? (
      <span
        className="text-xs h-3.5 w-3.5 cursor-pointer hover:font-bold"
        onClick={onClose}
      >
        {closeIcon}
      </span>
    ) : (
      <IconX
        className="inline-block h-3.5 w-3.5 text-xs cursor-pointer hover:font-bold"
        onClick={onClose}
      />
    )
  }

  return (
    <span
      className={cx(
        "px-1.5 border text-xs rounded flex items-center gap-x-0.5",
        ColorStyle[color],
        classname
      )}
    >
      {children}
      {mergeCloseIcon()}
    </span>
  )
}
