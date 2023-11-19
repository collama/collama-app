import { IconCircleXFilled } from "@tabler/icons-react"
import { forwardRef } from "react"
import { cl } from "~/common/utils"
import {
  TextArea as ColTextArea,
  type TextAreaProps as ColTextAreaProps,
} from "~/ui/Col-ui/Input/Textarea"
import type { TextAreaRef } from "~/ui/Col-ui/Input/Textarea/interface"

type Size = "sm" | "base"

export type TextAreaProps = {
  size?: Size
} & ColTextAreaProps

export const TextArea = forwardRef<TextAreaRef, TextAreaProps>(
  function TextArea({ allowClear, size = "base", className, ...props }, ref) {
    const renderClearIcon = () => {
      if (allowClear) {
        return {
          clearIcon: (
            <IconCircleXFilled className="h-4 w-4 text-neutral-400 opacity-50 hover:opacity-80 " />
          ),
        }
      }

      return false
    }
    return (
      <ColTextArea
        ref={ref}
        {...props}
        classNames={{
          textarea: cl(
            "w-full max-w-full resize-y rounded-lg border border-gray-300 px-3 py-1 align-text-bottom leading-6 outline-0 focus-within:border-violet-500",
            { "pe-2": !!allowClear },
            { "min-h-[32px]": !props.autoSize },
            SIZE[size],
            className
          ),
          affixWrapper:
            "relative inline-flex w-full min-w-0 border rounded-lg transition-all outline-0 focus-within:border-violet-500 border-gray-300 ",
          clearWrapper: "absolute end-1 top-1 flex items-center",
        }}
        allowClear={renderClearIcon()}
      />
    )
  }
)

const SIZE: Record<Size, string> = {
  sm: "text-sm",
  base: "text-base",
}
