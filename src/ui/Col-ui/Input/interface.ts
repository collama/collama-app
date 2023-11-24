import { type InputFocusOptions } from "./ults/common"
import { type LiteralUnion } from "./ults/types"
import type {
  CSSProperties,
  InputHTMLAttributes,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react"

export interface CommonInputProps {
  prefix?: ReactNode
  suffix?: ReactNode
  addonBefore?: ReactNode
  addonAfter?: ReactNode
  classNames?: {
    affixWrapper?: string
    prefix?: string
    suffix?: string
    addon?: string
  }
  styles?: {
    affixWrapper?: CSSProperties
    prefix?: CSSProperties
    suffix?: CSSProperties
  }
  allowClear?: boolean | { clearIcon?: ReactNode }
}
export interface BaseInputProps extends CommonInputProps {
  value?: InputHTMLAttributes<HTMLInputElement>["value"]
  inputElement: ReactElement<InputHTMLAttributes<HTMLInputElement>>
  className?: string
  style?: CSSProperties
  disabled?: boolean
  focused?: boolean
  triggerFocus?: () => void
  readOnly?: boolean
  handleReset?: MouseEventHandler
  hidden?: boolean
  components?: {
    affixWrapper?: "span" | "div"
    wrapper?: "span" | "div"
    groupAddon?: "span" | "div"
  }
}

export interface InputProps
  extends CommonInputProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix" | "type"> {
  // ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#%3Cinput%3E_types
  type?: LiteralUnion<
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week",
    string
  >
  onPressEnter?: KeyboardEventHandler<HTMLInputElement>
  autoComplete?: string
  htmlSize?: number
  classNames?: CommonInputProps["classNames"] & {
    input?: string
  }
  styles?: CommonInputProps["styles"] & {
    input?: CSSProperties
  }
}
export interface InputRef {
  focus: (options?: InputFocusOptions) => void
  blur: () => void
  setSelectionRange: (
    start: number,
    end: number,
    direction?: "forward" | "backward" | "none"
  ) => void
  clear: (e: MouseEvent<HTMLElement, MouseEvent>) => void
  select: () => void
  input: HTMLInputElement | null
}
