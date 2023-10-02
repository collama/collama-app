import type { BaseInputProps } from "../interface"
import type React from "react"
import type { CSSProperties } from "react"

export interface AutoSizeType {
  minRows?: number
  maxRows?: number
}

// To compatible with origin usage. We have to wrap this
export interface ResizableTextAreaRef {
  textArea: HTMLTextAreaElement | null
}

export type HTMLTextareaProps =
  React.TextareaHTMLAttributes<HTMLTextAreaElement>

export type TextAreaProps = Omit<HTMLTextareaProps, "onResize"> & {
  className?: string
  style?: React.CSSProperties
  autoSize?: boolean | AutoSizeType
  classNames?: {
    textarea?: string
    affixWrapper?: string
    clearWrapper?: string
  }
  styles?: {
    textarea?: CSSProperties
  }
} & Pick<BaseInputProps, "allowClear">

export type TextAreaRef = {
  resizableTextArea: ResizableTextAreaRef
  focus: () => void
  blur: () => void
}
