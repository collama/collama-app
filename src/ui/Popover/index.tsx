"use client"

import {
  Content,
  Root,
  Trigger,
  type PopoverContentProps,
} from "@radix-ui/react-popover"
import { forwardRef, type PropsWithChildren, type ReactNode } from "react"
import { cl } from "~/common/utils"

type Placement = "bottomRight"

const Placement: Record<
  Placement,
  Pick<PopoverContentProps, "side" | "align">
> = {
  bottomRight: {
    side: "bottom",
    align: "start",
  },
}

interface PopoverProps extends PropsWithChildren {
  content: ReactNode
  open?: boolean
  onOpenChange?: () => void
  placement?: Placement
  className?: string
}

export const Popover = forwardRef<null, PopoverProps>(function Popover(
  {
    content,
    className,
    children,
    open,
    onOpenChange,
    placement = "bottomRight",
    ...props
  },
  ref
) {
  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <Trigger asChild>{children}</Trigger>
      <Content
        {...Placement[placement]}
        ref={ref}
        className={cl(
          "z-50 rounded-lg bg-white border shadow-md mt-1 outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {content}
      </Content>
    </Root>
  )
})
