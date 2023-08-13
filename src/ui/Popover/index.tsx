"use client"

import { type FC, type PropsWithChildren, type ReactNode } from "react"
import {
  Popover as PopoverWarped,
  PopoverContent,
  PopoverTrigger,
} from "./components/PopoverContent"
import { type Placement } from "@floating-ui/react"

interface PopoverProps extends PropsWithChildren {
  content: ReactNode
  open?: boolean
  onOpenChange?: () => void
  placement?: Placement
}

export const Popover: FC<PopoverProps> = ({
  children,
  content,
  open,
  onOpenChange,
  placement,
}) => {
  if (open)
    return (
      <PopoverWarped
        placement={placement}
        open={open}
        onOpenChange={onOpenChange}
      >
        <PopoverTrigger onClick={onOpenChange}>{children}</PopoverTrigger>
        <PopoverContent className="Popover">{content}</PopoverContent>
      </PopoverWarped>
    )

  return (
    <PopoverWarped placement={placement}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="Popover">{content}</PopoverContent>
    </PopoverWarped>
  )
}