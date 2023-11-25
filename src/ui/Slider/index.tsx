"use client"

import { Root, Track, Range, Thumb } from "@radix-ui/react-slider"
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
} from "react"
import { cl } from "~/common/utils"

const Slider = forwardRef<
  ElementRef<typeof Root>,
  ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={cl(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-neutral-200">
      <Range className="absolute h-full bg-neutral-400" />
    </Track>
    <Thumb className="block h-4 w-4 cursor-grab rounded-full border border-neutral-400 bg-white transition-colors active:cursor-grabbing focus:border-violet-500 focus:ring-violet-300 focus:outline-none focus:ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </Root>
))
Slider.displayName = Root.displayName

export { Slider }
