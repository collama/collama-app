import type { FC, ReactElement } from "react"
import React, { cloneElement, useRef } from "react"
import type { BaseInputProps } from "./interface"
import { hasAddon, hasPrefixSuffix } from "./ults/common"
import cx from "classnames"

export const BaseInput: FC<BaseInputProps> = (props) => {
  const {
    inputElement,
    prefix,
    suffix,
    addonBefore,
    addonAfter,
    className,
    style,
    disabled,
    readOnly,
    focused,
    triggerFocus,
    allowClear,
    value,
    handleReset,
    hidden,
    classNames,
    styles,
    components,
  } = props

  const AffixWrapperComponent = components?.affixWrapper || "span"
  const WrapperComponent = components?.wrapper || "span"
  const GroupAddonComponent = components?.groupAddon || "span"

  const containerRef = useRef<HTMLDivElement>(null)

  const onInputClick: React.MouseEventHandler = (e) => {
    if (containerRef.current?.contains(e.target as Element)) {
      triggerFocus?.()
    }
  }

  // ================== Clear Icon ================== //
  const getClearIcon = () => {
    if (!allowClear) {
      return null
    }
    const needClear = !disabled && !readOnly && value
    const iconNode =
      typeof allowClear === "object" && allowClear?.clearIcon
        ? allowClear.clearIcon
        : "✖"
    return (
      <span
        onClick={handleReset}
        // Do not trigger onBlur when clear input
        // https://github.com/ant-design/ant-design/issues/31200
        onMouseDown={(e) => e.preventDefault()}
        style={{
          ...{
            cursor: "pointer",
            transition: "color .3s",
            verticalAlign: "-1px",
          },
          ...(!!suffix ? { padding: "0 4px" } : {}),
          ...(!needClear ? { display: "none" } : {}),
        }}
        role="button"
        tabIndex={-1}
      >
        {iconNode}
      </span>
    )
  }

  let element: ReactElement = cloneElement(inputElement, {
    value,
    hidden,
    className: cx({
      [className ?? ""]: !hasPrefixSuffix(props) && !hasAddon(props),
      [inputElement.props?.className ?? ""]:
        !hasPrefixSuffix(props) && !hasAddon(props),
    }),
    style: {
      ...(!hasPrefixSuffix(props) && !hasAddon(props) ? style : {}),
      ...(!hasPrefixSuffix(props) && !hasAddon(props)
        ? inputElement.props?.style
        : {}),
    },
  })

  // ================== Prefix & Suffix ================== //
  if (hasPrefixSuffix(props)) {
    const affixWrapperCls = cx(
      className,
      classNames?.affixWrapper,
    )

    const suffixNode = (suffix || allowClear) && (
      <span className={classNames?.suffix} style={styles?.suffix}>
        {getClearIcon()}
        {suffix}
      </span>
    )

    element = (
      <AffixWrapperComponent
        className={affixWrapperCls}
        style={{
          ...style,
          ...styles?.affixWrapper,
          ...inputElement.props?.style,
        }}
        hidden={!hasAddon(props) && hidden}
        onClick={onInputClick}
        ref={containerRef}
      >
        {prefix && (
          <span className={classNames?.prefix} style={styles?.prefix}>
            {prefix}
          </span>
        )}
        {cloneElement(inputElement, {
          value,
          hidden,
          className: cx(inputElement.props?.className),
          style: {
            ...(!hasPrefixSuffix(props) && !hasAddon(props) ? style : {}),
            ...(!hasPrefixSuffix(props) && !hasAddon(props)
              ? inputElement.props?.style
              : { border: "none", outline: "none" }),
          },
        })}
        {suffixNode}
      </AffixWrapperComponent>
    )
  }

  // ================== Addon ================== //
  // if (hasAddon(props)) {
  //   // Need another wrapper for changing display:table to display:inline-block
  //   // and put style prop in wrapper
  //   return (
  //     <WrapperComponent>
  //       {addonBefore && (
  //         <GroupAddonComponent className={classNames?.addon}>
  //           {addonBefore}
  //         </GroupAddonComponent>
  //       )}
  //       {cloneElement(element, {
  //         hidden: null,
  //       })}
  //       {addonAfter && (
  //         <GroupAddonComponent className={classNames?.addon}>
  //           {addonAfter}
  //         </GroupAddonComponent>
  //       )}
  //     </WrapperComponent>
  //   )
  // }
  return element
}
