import clsx from "classnames"
import useMergedState from "rc-util/lib/hooks/useMergedState"
import {
  type ChangeEvent,
  type CompositionEventHandler,
  type FocusEventHandler,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { ResizableTextArea } from "./ResizableTextArea"
import type {
  ResizableTextAreaRef,
  TextAreaProps,
  TextAreaRef,
} from "./interface"
import {
  fixControlledValue,
  resolveOnChange,
} from "~/ui/Col-ui/Input/ults/common"
import { BaseInput } from "~/ui/Col-ui/Input/BaseInput"

function fixEmojiLength(value: string, maxLength: number) {
  return [...(value || "")].slice(0, maxLength).join("")
}

function setTriggerValue(
  isCursorInEnd: boolean,
  preValue: string,
  triggerValue: string,
  maxLength: number
) {
  let newTriggerValue = triggerValue
  if (isCursorInEnd) {
    // 光标在尾部，直接截断
    newTriggerValue = fixEmojiLength(triggerValue, maxLength)
  } else if (
    [...(preValue || "")].length < triggerValue.length &&
    [...(triggerValue || "")].length > maxLength
  ) {
    // 光标在中间，如果最后的值超过最大值，则采用原先的值
    newTriggerValue = preValue
  }
  return newTriggerValue
}

export const TextArea = forwardRef<TextAreaRef, TextAreaProps>(
  function TextArea(
    {
      defaultValue,
      value: customValue,
      onFocus,
      onBlur,
      onChange,
      allowClear,
      maxLength,
      onCompositionStart,
      onCompositionEnd,
      className,
      style,
      disabled,
      hidden,
      classNames,
      styles,
      ...rest
    },
    ref
  ) {
    const [value, setValue] = useMergedState(defaultValue, {
      value: customValue,
      defaultValue,
    })
    const resizableTextAreaRef = useRef<ResizableTextAreaRef>({
      textArea: null,
    })

    const [focused, setFocused] = useState<boolean>(false)

    const [compositing, setCompositing] = useState(false)
    const oldCompositionValueRef = useRef<string>()
    const oldSelectionStartRef = useRef<number>(0)
    const [textareaResized, setTextareaResized] = useState<boolean>(false)

    const focus = () => {
      resizableTextAreaRef.current?.textArea?.focus()
    }

    useImperativeHandle(ref, () => ({
      resizableTextArea: resizableTextAreaRef.current,
      focus,
      blur: () => {
        resizableTextAreaRef.current?.textArea?.blur()
      },
    }))

    useEffect(() => {
      setFocused((prev) => !disabled && prev)
    }, [disabled])

    // =========================== Value Update ===========================
    // Max length value
    const hasMaxLength = (maxLength?: number): maxLength is number => {
      return maxLength !== undefined && maxLength !== null && maxLength > 0
    }

    const onInternalCompositionStart: CompositionEventHandler<
      HTMLTextAreaElement
    > = (e) => {
      setCompositing(true)
      // 拼音输入前保存一份旧值
      oldCompositionValueRef.current = value as string
      // 保存旧的光标位置
      oldSelectionStartRef.current = e.currentTarget.selectionStart
      onCompositionStart?.(e)
    }

    const onInternalCompositionEnd: CompositionEventHandler<
      HTMLTextAreaElement
    > = (e) => {
      setCompositing(false)

      let triggerValue = e.currentTarget.value
      if (hasMaxLength(maxLength)) {
        const isCursorInEnd =
          oldSelectionStartRef.current >= maxLength + 1 ||
          oldSelectionStartRef.current ===
            oldCompositionValueRef.current?.length
        triggerValue = setTriggerValue(
          isCursorInEnd,
          oldCompositionValueRef.current as string,
          triggerValue,
          maxLength
        )
      }
      // Patch composition onChange when value changed
      if (triggerValue !== value) {
        setValue(triggerValue)
        resolveOnChange(e.currentTarget, e, onChange, triggerValue)
      }

      onCompositionEnd?.(e)
    }

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      let triggerValue = e.target.value
      if (!compositing && hasMaxLength(maxLength)) {
        // 1. 复制粘贴超过maxlength的情况 2.未超过maxlength的情况
        const isCursorInEnd =
          e.target.selectionStart >= maxLength + 1 ||
          e.target.selectionStart === triggerValue.length ||
          !e.target.selectionStart
        triggerValue = setTriggerValue(
          isCursorInEnd,
          value as string,
          triggerValue,
          maxLength
        )
      }
      setValue(triggerValue)
      resolveOnChange(e.currentTarget, e, onChange, triggerValue)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      const { onKeyDown } = rest
      onKeyDown?.(e)
    }

    const handleFocus: FocusEventHandler<HTMLTextAreaElement> = (e) => {
      setFocused(true)
      onFocus?.(e)
    }

    const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (e) => {
      setFocused(false)
      onBlur?.(e)
    }

    // ============================== Reset ===============================
    const handleReset = (e: ReactMouseEvent<HTMLElement, MouseEvent>) => {
      setValue("")
      focus()
      if (resizableTextAreaRef.current.textArea)
        resolveOnChange(resizableTextAreaRef.current.textArea, e, onChange)
    }

    let val = fixControlledValue(value)

    if (
      !compositing &&
      hasMaxLength(maxLength) &&
      (customValue === null || customValue === undefined)
    ) {
      // fix #27612 将value转为数组进行截取，解决 '😂'.length === 2 等emoji表情导致的截取乱码的问题
      val = fixEmojiLength(val, maxLength)
    }


    const isPureTextArea = !rest.autoSize && !allowClear

    return (
      <BaseInput
        value={val}
        allowClear={allowClear}
        handleReset={handleReset}
        classNames={{
          affixWrapper: clsx(classNames?.affixWrapper),
          suffix: classNames?.clearWrapper,
        }}
        disabled={disabled}
        focused={focused}
        className={className}
        style={{
          ...style,
          ...(textareaResized && !isPureTextArea ? { height: "auto" } : {}),
        }}
        hidden={hidden}
        inputElement={
          <ResizableTextArea
            {...rest}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onCompositionStart={onInternalCompositionStart}
            onCompositionEnd={onInternalCompositionEnd}
            className={classNames?.textarea}
            style={{ ...styles?.textarea, resize: style?.resize }}
            styles={{
              textarea: { ...(allowClear ? { paddingInlineEnd: "24px" } : {}) },
            }}
            disabled={disabled}
            ref={resizableTextAreaRef}
          />
        }
      />
    )
  }
)
