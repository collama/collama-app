import { BaseInput } from "./BaseInput"
import type { InputProps, InputRef } from "./interface"
import {
  fixControlledValue,
  type InputFocusOptions,
  resolveOnChange,
  triggerFocus,
} from "./ults/common"
import omit from "./ults/omit"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import useMergedState from "~/ui/Col-ui/utils/hooks/useMergedState"

export const Input = forwardRef<InputRef, InputProps>(function Input(
  props,
  ref
) {
  const {
    autoComplete,
    onChange,
    onFocus,
    onBlur,
    onPressEnter,
    onKeyDown,
    disabled,
    htmlSize,
    className,
    suffix,
    type = "text",
    classNames,
    styles,
    ...rest
  } = props

  const [value, setValue] = useMergedState(props.defaultValue, {
    value: props.value,
  })

  const [focused, setFocused] = useState<boolean>(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const focus = (option?: InputFocusOptions) => {
    if (inputRef.current) {
      triggerFocus(inputRef.current, option)
    }
  }

  useImperativeHandle(ref, () => ({
    focus,
    blur: () => {
      inputRef.current?.blur()
    },
    setSelectionRange: (
      start: number,
      end: number,
      direction?: "forward" | "backward" | "none"
    ) => {
      inputRef.current?.setSelectionRange(start, end, direction)
    },
    select: () => {
      inputRef.current?.select()
    },
    clear: (e: React.MouseEvent<HTMLElement, MouseEvent>) => handleReset(e),
    input: inputRef.current,
  }))

  useEffect(() => {
    setFocused((prev) => (prev && disabled ? false : prev))
  }, [disabled])

  const onInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)

    if (inputRef.current) {
      resolveOnChange(inputRef.current, e, onChange)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (onPressEnter && e.key === "Enter") {
      onPressEnter(e)
    }
    onKeyDown?.(e)
  }

  const handleFocus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setFocused(true)
    onFocus?.(e)
  }

  const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setFocused(false)
    onBlur?.(e)
  }

  const handleReset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setValue("")
    focus()
    if (inputRef.current) {
      resolveOnChange(inputRef.current, e, onChange)
    }
  }

  const getInputElement = () => {
    // Fix https://fb.me/react-unknown-prop
    const otherProps = omit(props, [
      "onPressEnter",
      "addonBefore",
      "addonAfter",
      "prefix",
      "suffix",
      "allowClear",
      // Input elements must be either controlled or uncontrolled,
      // specify either the value prop, or the defaultValue prop, but not both.
      "defaultValue",
      "htmlSize",
      "styles",
      "classNames",
    ])

    return (
      <input
        autoComplete={autoComplete}
        {...otherProps}
        onChange={onInternalChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={classNames?.input}
        style={styles?.input}
        ref={inputRef}
        size={htmlSize}
        type={type}
      />
    )
  }

  return (
    <BaseInput
      {...rest}
      className={className}
      inputElement={getInputElement()}
      handleReset={handleReset}
      value={fixControlledValue(value)}
      focused={focused}
      triggerFocus={focus}
      suffix={suffix}
      disabled={disabled}
      classNames={classNames}
      styles={styles}
    />
  )
})
