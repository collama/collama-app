import {
  useState,
  useMemo,
  useCallback,
  forwardRef,
  PropsWithChildren,
  ReactElement,
  HTMLAttributes,
  Ref,
  CSSProperties,
  Key,
  ReactNode,
} from "react"
import classNames from "classnames"
import ResizeObserver from "rc-resize-observer"
import Item from "./Item"
import type { ComponentType } from "./RawItem"
import RawItem from "./RawItem"
import { OverflowContext } from "./context"
import { useLayoutEffect } from "~/ui/Col-ui/utils/hooks/useLayoutEffect"
import useEffectState, {
  useBatcher,
} from "~/ui/Col-ui/utils/hooks/useEffectState"

const RESPONSIVE = "responsive" as const
const INVALIDATE = "invalidate" as const

export { OverflowContext } from "./context"

export type { ComponentType } from "./RawItem"

export type OverflowItemType = {
  value: string | number
  label: string
}

export interface OverflowProps extends HTMLAttributes<any> {
  prefixCls?: string
  className?: string
  style?: CSSProperties
  data?: OverflowItemType[]
  itemKey?: Key | ((item: OverflowItemType) => Key)
  /** Used for `responsive`. It will limit render node to avoid perf issue */
  itemWidth?: number
  renderItem?: (item: OverflowItemType) => ReactNode
  /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
  renderRawItem?: (item: OverflowItemType, index: number) => ReactElement
  maxCount?: number | typeof RESPONSIVE | typeof INVALIDATE
  renderRest?: ReactNode | ((omittedItems: OverflowItemType[]) => ReactNode)
  /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
  renderRawRest?: (omittedItems: OverflowItemType[]) => ReactElement
  suffix?: ReactNode
  component?: ComponentType
  itemComponent?: ComponentType

  /** @private This API may be refactor since not well design */
  onVisibleChange?: (visibleCount: number) => void

  /** When set to `full`, ssr will render full items by default and remove at client side */
  ssr?: "full"
}

function defaultRenderRest<OverflowItemType>(omittedItems: OverflowItemType[]) {
  return `+ ${omittedItems.length} ...`
}

function Overflow(props: OverflowProps, ref: Ref<HTMLDivElement>) {
  const {
    prefixCls = "rc-overflow",
    data = [],
    renderItem,
    renderRawItem,
    itemKey,
    itemWidth = 10,
    ssr,
    style,
    className,
    maxCount,
    renderRest,
    renderRawRest,
    suffix,
    component: Component = "div",
    itemComponent,
    onVisibleChange,
    ...restProps
  } = props

  const fullySSR = ssr === "full"

  const notifyEffectUpdate = useBatcher()

  const [containerWidth, setContainerWidth] = useEffectState<number>(
    notifyEffectUpdate,
    null
  )
  const mergedContainerWidth = containerWidth || 0

  const [itemWidths, setItemWidths] = useEffectState(
    notifyEffectUpdate,
    new Map<Key, number>()
  )

  const [prevRestWidth, setPrevRestWidth] = useEffectState<number>(
    notifyEffectUpdate,
    0
  )
  const [restWidth, setRestWidth] = useEffectState<number>(
    notifyEffectUpdate,
    0
  )

  const [suffixWidth, setSuffixWidth] = useEffectState<number>(
    notifyEffectUpdate,
    0
  )
  const [suffixFixedStart, setSuffixFixedStart] = useState<number | null>(null)

  const [displayCount, setDisplayCount] = useState<number | null>(null)
  const mergedDisplayCount = useMemo(() => {
    if (displayCount === null && fullySSR) {
      return Number.MAX_SAFE_INTEGER
    }

    return displayCount || 0
  }, [displayCount, containerWidth])

  const [restReady, setRestReady] = useState(false)

  const itemPrefixCls = `${prefixCls}-item`

  // Always use the max width to avoid blink
  const mergedRestWidth = Math.max(prevRestWidth, restWidth)

  // ================================= Data =================================
  const isResponsive = maxCount === RESPONSIVE
  const shouldResponsive = !!data.length && isResponsive
  const invalidate = maxCount === INVALIDATE

  /**
   * When is `responsive`, we will always render rest node to get the real width of it for calculation
   */
  const showRest =
    shouldResponsive || (typeof maxCount === "number" && data.length > maxCount)

  const mergedData = useMemo(() => {
    let items = data

    if (shouldResponsive) {
      if (containerWidth === null && fullySSR) {
        items = data
      } else {
        items = data.slice(
          0,
          Math.min(data.length, mergedContainerWidth / itemWidth)
        )
      }
    } else if (typeof maxCount === "number") {
      items = data.slice(0, maxCount)
    }

    return items
  }, [data, itemWidth, containerWidth, maxCount, shouldResponsive])

  const omittedItems = useMemo(() => {
    if (shouldResponsive) {
      return data.slice(mergedDisplayCount + 1)
    }
    return data.slice(mergedData.length)
  }, [data, mergedData, shouldResponsive, mergedDisplayCount])

  // ================================= Item =================================
  const getKey = useCallback<(item: OverflowItemType, index: number) => Key>(
    (item: OverflowItemType, index: number) => {
      if (typeof itemKey === "function") {
        return itemKey(item)
      }

      if ((itemKey && itemKey === "value") || itemKey === "label") {
        return item[itemKey]
      }

      return index
    },
    [itemKey]
  )

  const mergedRenderItem = useCallback(
    renderItem ??
      ((item: OverflowItemType): ReactNode => <span>{item.value}</span>),
    [renderItem]
  )

  function updateDisplayCount(
    count: number,
    suffixFixedStartVal?: number,
    notReady?: boolean
  ) {
    // React 18 will sync render even when the value is same in some case.
    // We take `mergedData` as deps which may cause dead loop if it's dynamic generate.
    // ref: https://github.com/ant-design/ant-design/issues/36559
    if (
      displayCount === count &&
      (suffixFixedStartVal === undefined ||
        suffixFixedStartVal === suffixFixedStart)
    ) {
      return
    }

    setDisplayCount(count)
    if (!notReady) {
      setRestReady(count < data.length - 1)

      onVisibleChange?.(count)
    }

    if (suffixFixedStartVal !== undefined) {
      setSuffixFixedStart(suffixFixedStartVal)
    }
  }

  // ================================= Size =================================
  function onOverflowResize(_: object, element: HTMLElement) {
    setContainerWidth(element.clientWidth)
  }

  function registerSize(key: Key, width: number | null) {
    setItemWidths((origin) => {
      const clone = new Map(origin)

      if (width === null) {
        clone.delete(key)
      } else {
        clone.set(key, width)
      }
      return clone
    })
  }

  function registerOverflowSize(_: Key, width: number | null) {
    if (!width) return

    setRestWidth(width)
    setPrevRestWidth(restWidth)
  }

  function registerSuffixSize(_: Key, width: number | null) {
    if (!width) return

    setSuffixWidth(width)
  }

  // ================================ Effect ================================
  function getItemWidth(index: number) {
    const data = mergedData[index]

    if (!data) return 0

    return itemWidths.get(getKey(data, index)) ?? 0
  }

  useLayoutEffect(() => {
    if (mergedContainerWidth && mergedData) {
      let totalWidth = suffixWidth

      const len = mergedData.length
      const lastIndex = len - 1

      // When data count change to 0, reset this since not loop will reach
      if (!len) {
        updateDisplayCount(0)
        return
      }

      for (let i = 0; i < len; i += 1) {
        let currentItemWidth = getItemWidth(i)

        // Fully will always render
        if (fullySSR) {
          currentItemWidth = currentItemWidth || 0
        }

        // Break since data not ready
        if (currentItemWidth === undefined) {
          updateDisplayCount(i - 1, undefined, true)
          break
        }

        // Find best match
        totalWidth += currentItemWidth

        if (
          // Only one means `totalWidth` is the final width
          (lastIndex === 0 && totalWidth <= mergedContainerWidth) ||
          // Last two width will be the final width
          (i === lastIndex - 1 &&
            totalWidth + getItemWidth(lastIndex) <= mergedContainerWidth)
        ) {
          // Additional check if match the end
          updateDisplayCount(lastIndex)
          break
        } else if (totalWidth + mergedRestWidth > mergedContainerWidth) {
          // Can not hold all the content to show rest
          updateDisplayCount(
            i - 1,
            totalWidth - currentItemWidth - suffixWidth + restWidth
          )
          break
        }
      }

      if (suffix && getItemWidth(0) + suffixWidth > mergedContainerWidth) {
        setSuffixFixedStart(null)
      }
    }
  }, [
    mergedContainerWidth,
    itemWidths,
    restWidth,
    suffixWidth,
    getKey,
    mergedData,
  ])

  // ================================ Render ================================
  const displayRest = restReady && !!omittedItems.length

  let suffixStyle: CSSProperties = {}
  if (suffixFixedStart !== null && shouldResponsive) {
    suffixStyle = {
      position: "absolute",
      left: suffixFixedStart,
      top: 0,
    }
  }

  const itemSharedProps = {
    prefixCls: itemPrefixCls,
    responsive: shouldResponsive,
    component: itemComponent,
    invalidate,
  }

  // >>>>> Choice render fun by `renderRawItem`
  const internalRenderItemNode = renderRawItem
    ? (item: OverflowItemType, index: number) => {
        const key = getKey(item, index)

        return (
          <OverflowContext.Provider
            key={key}
            value={{
              ...itemSharedProps,
              order: index,
              item,
              itemKey: key,
              registerSize,
              display: index <= mergedDisplayCount,
            }}
          >
            {renderRawItem(item, index)}
          </OverflowContext.Provider>
        )
      }
    : (item: OverflowItemType, index: number) => {
        const key = getKey(item, index)

        return (
          <Item
            {...itemSharedProps}
            order={index}
            key={key}
            item={item}
            renderItem={mergedRenderItem}
            itemKey={key}
            registerSize={registerSize}
            display={index <= mergedDisplayCount}
          />
        )
      }

  // >>>>> Rest node
  let restNode: ReactNode
  const restContextProps = {
    order: displayRest ? mergedDisplayCount : Number.MAX_SAFE_INTEGER,
    className: `${itemPrefixCls}-rest`,
    registerSize: registerOverflowSize,
    display: displayRest,
  }

  if (!renderRawRest) {
    const mergedRenderRest = renderRest || defaultRenderRest

    restNode = (
      <Item
        {...itemSharedProps}
        // When not show, order should be the last
        {...restContextProps}
      >
        {typeof mergedRenderRest === "function"
          ? mergedRenderRest(omittedItems)
          : mergedRenderRest}
      </Item>
    )
  } else if (renderRawRest) {
    restNode = (
      <OverflowContext.Provider
        value={{
          ...itemSharedProps,
          ...restContextProps,
        }}
      >
        {renderRawRest(omittedItems)}
      </OverflowContext.Provider>
    )
  }

  let overflowNode = (
    <Component
      className={classNames(!invalidate && prefixCls, className)}
      style={style}
      ref={ref}
      {...restProps}
    >
      {mergedData.map(internalRenderItemNode)}

      {/* Rest Count Item */}
      {showRest ? restNode : null}

      {/* Suffix Node */}
      {suffix && (
        <Item
          {...itemSharedProps}
          responsive={isResponsive}
          responsiveDisabled={!shouldResponsive}
          order={mergedDisplayCount}
          className={`${itemPrefixCls}-suffix`}
          registerSize={registerSuffixSize}
          display
          style={suffixStyle}
        >
          {suffix}
        </Item>
      )}
    </Component>
  )

  if (isResponsive) {
    overflowNode = (
      <ResizeObserver onResize={onOverflowResize} disabled={!shouldResponsive}>
        {overflowNode}
      </ResizeObserver>
    )
  }

  return overflowNode
}

const ForwardOverflow = forwardRef(Overflow)

type ForwardOverflowType = (
  props: PropsWithChildren<OverflowProps> & {
    ref?: Ref<HTMLDivElement>
  }
) => ReactElement

type FilledOverflowType = ForwardOverflowType & {
  Item: typeof RawItem
  RESPONSIVE: typeof RESPONSIVE
  /** Will work as normal `component`. Skip patch props like `prefixCls`. */
  INVALIDATE: typeof INVALIDATE
}

ForwardOverflow.displayName = "Overflow"
;(ForwardOverflow as unknown as FilledOverflowType).Item = RawItem
;(ForwardOverflow as unknown as FilledOverflowType).RESPONSIVE = RESPONSIVE
;(ForwardOverflow as unknown as FilledOverflowType).INVALIDATE = INVALIDATE

// Convert to generic type
export default ForwardOverflow as unknown as FilledOverflowType
