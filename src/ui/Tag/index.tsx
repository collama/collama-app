import cx from "classnames"
import type { FC, PropsWithChildren } from "react"

type TagColor = "green" | "red" | "normal"
interface TagProps extends PropsWithChildren {
  color?: TagColor
}

const ColorStyle: Record<TagColor, string> = {
  normal: "bg-stone-100",
  red: "bg-red-50 border-red-200 text-red-400",
  green: "bg-green-50 border-green-200 text-green-400",
}

export const Tag: FC<TagProps> = ({ children, color = "normal" }) => {
  return (
    <span
      className={cx("p-1 border text-xs rounded leading-3", ColorStyle[color])}
    >
      {children}
    </span>
  )
}
