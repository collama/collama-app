import {Ref, Key, forwardRef, useEffect, ReactNode, CSSProperties, HTMLAttributes} from "react"
import classNames from "classnames"
import ResizeObserver from "rc-resize-observer"
import type { ComponentType } from "./RawItem"
import { OverflowItemType } from "~/ui/Col-ui/Overflow/Overflow"

// Use shared variable to save bundle size
const UNDEFINED = undefined

export interface ItemProps extends HTMLAttributes<any> {
  prefixCls: string
  item?: OverflowItemType
  className?: string
  style?: CSSProperties
  renderItem?: (item: OverflowItemType) => ReactNode
  responsive?: boolean
  // https://github.com/ant-design/ant-design/issues/35475
  /**
   * @private To make node structure stable. We need keep wrap with ResizeObserver.
   * But disable it when it's no need to real measure.
   */
  responsiveDisabled?: boolean
  itemKey?: Key
  registerSize: (key: Key, width: number | null) => void
  children?: ReactNode
  display: boolean
  order: number
  component?: ComponentType
  invalidate?: boolean
}

function InternalItem(props: ItemProps, ref: Ref<any>) {
  const {
    prefixCls,
    invalidate,
    item,
    renderItem,
    responsive,
    responsiveDisabled,
    registerSize,
    itemKey,
    className,
    style,
    children,
    display,
    order,
    component: Component = "div",
    ...restProps
  } = props

  const mergedHidden = responsive && !display

  // ================================ Effect ================================
  function internalRegisterSize(width: number | null) {
    if (!itemKey) return

    registerSize(itemKey, width)
  }

  useEffect(
    () => () => {
      internalRegisterSize(null)
    },
    []
  )

  // ================================ Render ================================
  const childNode =
    renderItem && item !== UNDEFINED ? renderItem(item) : children

  let overflowStyle: CSSProperties | undefined
  if (!invalidate) {
    overflowStyle = {
      opacity: mergedHidden ? 0 : 1,
      height: mergedHidden ? 0 : UNDEFINED,
      overflowY: mergedHidden ? "hidden" : UNDEFINED,
      order: responsive ? order : UNDEFINED,
      pointerEvents: mergedHidden ? "none" : UNDEFINED,
      position: mergedHidden ? "absolute" : UNDEFINED,
    }
  }

  const overflowProps: HTMLAttributes<any> = {}
  if (mergedHidden) {
    overflowProps["aria-hidden"] = true
  }

  let itemNode = (
    <Component
      className={classNames(!invalidate && prefixCls, className)}
      style={{
        ...overflowStyle,
        ...style,
      }}
      {...overflowProps}
      {...restProps}
      ref={ref}
    >
      {childNode}
    </Component>
  )

  if (responsive) {
    itemNode = (
      <ResizeObserver
        onResize={({ offsetWidth }) => {
          internalRegisterSize(offsetWidth)
        }}
        disabled={responsiveDisabled}
      >
        {itemNode}
      </ResizeObserver>
    )
  }

  return itemNode
}

const Item = forwardRef(InternalItem)
Item.displayName = "Item"

export default Item
