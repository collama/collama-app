import {
  useRef,
  useState,
  useLayoutEffect,
  forwardRef,
  CSSProperties,
  FC,
  ComponentClass,
  UIEventHandler,
  ReactNode,
  Ref,
  Key,
  useCallback,
  useMemo,
  UIEvent,
  useImperativeHandle,
  HTMLAttributes,
} from "react"
import { flushSync } from "react-dom"
import classNames from "classnames"
import type { ResizeObserverProps } from "rc-resize-observer"
import ResizeObserver from "rc-resize-observer"
import Filler from "./Filler"
import type { InnerProps } from "./Filler"
import type { ScrollBarDirectionType, ScrollBarRef } from "./ScrollBar"
import ScrollBar from "./ScrollBar"
import type {
  RenderFunc,
  SharedConfig,
  GetKey,
  ExtraRenderInfo,
} from "./interface"
import useChildren from "./hooks/useChildren"
import useHeights from "./hooks/useHeights"
import useScrollTo from "./hooks/useScrollTo"
import type { ScrollPos, ScrollTarget } from "./hooks/useScrollTo"
import useDiffItem from "./hooks/useDiffItem"
import useFrameWheel from "./hooks/useFrameWheel"
import useMobileTouchMove from "./hooks/useMobileTouchMove"
import useOriginScroll from "./hooks/useOriginScroll"
import { getSpinSize } from "./utils/scrollbarUtil"
import { useGetSize } from "./hooks/useGetSize"
import {useEvent} from "~/ui/Col-ui/utils/hooks/useEvent";

const EMPTY_DATA: never[] = []

const ScrollStyle: CSSProperties = {
  overflowY: "auto",
  overflowAnchor: "none",
}

export interface ScrollInfo {
  x: number
  y: number
}

export type ScrollConfig = ScrollTarget | ScrollPos

export type ScrollTo = (arg: number | ScrollConfig) => void

export type ListRef = {
  scrollTo: ScrollTo
  getScrollInfo: () => ScrollInfo
}

export interface ListProps<T extends Record<string, any>>
  extends Omit<HTMLAttributes<any>, "children"> {
  prefixCls?: string
  children: RenderFunc<T>
  data: T[]
  height?: number
  itemHeight?: number
  /** If not match virtual scroll condition, Set List still use height of container. */
  fullHeight?: boolean
  itemKey: Key | ((item: T) => Key)
  // component?: string |FC<any> |ComponentClass<any>;
  component?: string | FC<any> | ComponentClass<any>
  /** Set `false` will always use real scroll instead of virtual one */
  virtual?: boolean
  direction?: ScrollBarDirectionType
  /**
   * By default `scrollWidth` is same as container.
   * When set this, it will show the horizontal scrollbar and
   * `scrollWidth` will be used as the real width instead of container width.
   * When set, `virtual` will always be enabled.
   */
  scrollWidth?: number

  onScroll?: UIEventHandler<HTMLElement>

  /**
   * Given the virtual offset value.
   * It's the logic offset from start position.
   */
  onVirtualScroll?: (info: ScrollInfo) => void

  /** Trigger when render list item changed */
  onVisibleChange?: (visibleList: T[], fullList: T[]) => void

  /** Inject to inner container props. Only use when you need pass aria related data */
  innerProps?: InnerProps

  /** Render extra content into Filler */
  extraRender?: (info: ExtraRenderInfo) => ReactNode
}

export function RawList<T extends Record<string, any>>(
  props: ListProps<T>,
  ref: Ref<ListRef>
) {
  const {
    prefixCls = "rc-virtual-list",
    className,
    height = 0,
    itemHeight,
    fullHeight = true,
    style,
    data,
    children,
    itemKey,
    virtual,
    direction,
    scrollWidth,
    component: Component = "div",
    onScroll,
    onVirtualScroll,
    onVisibleChange,
    innerProps,
    extraRender,
    ...restProps
  } = props

  // ================================= MISC =================================
  const useVirtual = !!(virtual !== false && height && itemHeight)
  const inVirtual =
    useVirtual && data && (itemHeight * data.length > height || !!scrollWidth)
  const isRTL = direction === "rtl"

  const mergedClassName = classNames(
    prefixCls,
    { [`${prefixCls}-rtl`]: isRTL },
    className
  )
  const mergedData = data || EMPTY_DATA
  const componentRef = useRef<HTMLDivElement | null>(null)
  const fillerInnerRef = useRef<HTMLDivElement | null>(null)

  // =============================== Item Key ===============================

  const [offsetTop, setOffsetTop] = useState(0)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [scrollMoving, setScrollMoving] = useState(false)

  const onScrollbarStartMove = () => {
    setScrollMoving(true)
  }
  const onScrollbarStopMove = () => {
    setScrollMoving(false)
  }

  // =============================== Item Key ===============================
  const getKey = useCallback<GetKey<T>>(
    (item: T) => {
      if (typeof itemKey === "function") {
        return itemKey(item)
      }

      return item?.[itemKey] as Key
    },
    [itemKey]
  )

  const sharedConfig: SharedConfig<T> = {
    getKey,
  }

  // ================================ Scroll ================================
  function syncScrollTop(newTop: number | ((prev: number) => number)) {
    setOffsetTop((origin) => {
      let value: number
      if (typeof newTop === "function") {
        value = newTop(origin)
      } else {
        value = newTop
      }

      const alignedTop = keepInRange(value)

      if (componentRef.current && "scrollTop" in componentRef.current) {
        componentRef.current.scrollTop = alignedTop
      }
      return alignedTop
    })
  }

  // ================================ Legacy ================================
  // Put ref here since the range is generate by follow
  const rangeRef = useRef({ start: 0, end: mergedData.length })

  const diffItemRef = useRef<T>()
  const [diffItem] = useDiffItem(mergedData, getKey)
  diffItemRef.current = diffItem

  // ================================ Height ================================
  const [setInstanceRef, collectHeight, heights, heightUpdatedMark] =
    useHeights(getKey, undefined, undefined)

  // ========================== Visible Calculation =========================
  const {
    scrollHeight,
    start,
    end,
    offset: fillerOffset,
  } = useMemo(() => {
    if (!useVirtual) {
      return {
        scrollHeight: undefined,
        start: 0,
        end: mergedData.length - 1,
        offset: undefined,
      }
    }

    // Always use virtual scroll bar in avoid shaking
    if (!inVirtual) {
      return {
        scrollHeight: fillerInnerRef.current?.offsetHeight || 0,
        start: 0,
        end: mergedData.length - 1,
        offset: undefined,
      }
    }

    let itemTop = 0
    let startIndex: number | undefined
    let startOffset: number | undefined
    let endIndex: number | undefined

    const dataLen = mergedData.length
    for (let i = 0; i < dataLen; i += 1) {
      const item = mergedData[i]

      const key = getKey(item!)

      const cacheHeight = heights.get(key)
      const currentItemBottom =
        itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight)

      // Check item top in the range
      if (currentItemBottom >= offsetTop && startIndex === undefined) {
        startIndex = i
        startOffset = itemTop
      }

      // Check item bottom in the range. We will render additional one item for motion usage
      if (currentItemBottom > offsetTop + height && endIndex === undefined) {
        endIndex = i
      }

      itemTop = currentItemBottom
    }

    // When scrollTop at the end but data cut to small count will reach this
    if (startIndex === undefined) {
      startIndex = 0
      startOffset = 0

      endIndex = Math.ceil(height / itemHeight)
    }
    if (endIndex === undefined) {
      endIndex = mergedData.length - 1
    }

    // Give cache to improve scroll experience
    endIndex = Math.min(endIndex + 1, mergedData.length - 1)

    return {
      scrollHeight: itemTop,
      start: startIndex,
      end: endIndex,
      offset: startOffset,
    }
  }, [inVirtual, useVirtual, offsetTop, mergedData, heightUpdatedMark, height])

  rangeRef.current.start = start
  rangeRef.current.end = end

  // ================================= Size =================================
  const [size, setSize] = useState({ width: 0, height })
  const onHolderResize: ResizeObserverProps["onResize"] = (sizeInfo) => {
    setSize(sizeInfo)
  }

  // Hack on scrollbar to enable flash call
  const verticalScrollBarRef = useRef<ScrollBarRef | null>(null)
  const horizontalScrollBarRef = useRef<ScrollBarRef | null>(null)

  const horizontalScrollBarSpinSize = useMemo(
    () => getSpinSize(size.width, scrollWidth),
    [size.width, scrollWidth]
  )
  const verticalScrollBarSpinSize = useMemo(
    () => getSpinSize(size.height, scrollHeight),
    [size.height, scrollHeight]
  )

  // =============================== In Range ===============================
  const maxScrollHeight = scrollHeight && height && scrollHeight - height
  const maxScrollHeightRef = useRef(maxScrollHeight)
  maxScrollHeightRef.current = maxScrollHeight

  function keepInRange(newScrollTop: number) {
    let newTop = newScrollTop
    if (
      !Number.isNaN(maxScrollHeightRef.current) &&
      maxScrollHeightRef.current
    ) {
      newTop = Math.min(newTop, maxScrollHeightRef.current)
    }
    newTop = Math.max(newTop, 0)
    return newTop
  }

  const isScrollAtTop = offsetTop <= 0
  const isScrollAtBottom = offsetTop >= (maxScrollHeight ?? 0)

  const originScroll = useOriginScroll(isScrollAtTop, isScrollAtBottom)

  // ================================ Scroll ================================
  const getVirtualScrollInfo = () => ({
    x: isRTL ? -offsetLeft : offsetLeft,
    y: offsetTop,
  })

  const lastVirtualScrollInfoRef = useRef(getVirtualScrollInfo())

  const triggerScroll = useEvent(() => {
    if (onVirtualScroll) {
      const nextInfo = getVirtualScrollInfo()

      // Trigger when offset changed
      if (
        lastVirtualScrollInfoRef.current.x !== nextInfo.x ||
        lastVirtualScrollInfoRef.current.y !== nextInfo.y
      ) {
        onVirtualScroll(nextInfo)

        lastVirtualScrollInfoRef.current = nextInfo
      }
    }
  })

  function onScrollBar(newScrollOffset: number, horizontal?: boolean) {
    const newOffset = newScrollOffset

    if (horizontal) {
      flushSync(() => {
        setOffsetLeft(newOffset)
      })
      triggerScroll()
    } else {
      syncScrollTop(newOffset)
    }
  }

  // When data size reduce. It may trigger native scroll event back to fit scroll position
  function onFallbackScroll(e: UIEvent<HTMLDivElement>) {
    const { scrollTop: newScrollTop } = e.currentTarget
    if (newScrollTop !== offsetTop) {
      syncScrollTop(newScrollTop)
    }

    // Trigger origin onScroll
    onScroll?.(e)
    triggerScroll()
  }

  const keepInHorizontalRange = (nextOffsetLeft: number) => {
    let tmpOffsetLeft = nextOffsetLeft
    const max = scrollWidth && scrollWidth - size.width
    tmpOffsetLeft = Math.max(tmpOffsetLeft, 0)
    tmpOffsetLeft = Math.min(tmpOffsetLeft, max ?? 0)

    return tmpOffsetLeft
  }

  const onWheelDelta: Parameters<typeof useFrameWheel>[4] = useEvent(
    (offsetXY, fromHorizontal) => {
      if (fromHorizontal) {
        // Horizontal scroll no need sync virtual position

        flushSync(() => {
          setOffsetLeft((left) => {
            const nextOffsetLeft = left + (isRTL ? -offsetXY : offsetXY)

            return keepInHorizontalRange(nextOffsetLeft)
          })
        })

        triggerScroll()
      } else {
        syncScrollTop((top) => {
          const newTop = top + offsetXY
          return newTop
        })
      }
    }
  )

  // Since this added in global,should use ref to keep update
  const [onRawWheel, onFireFoxScroll] = useFrameWheel(
    useVirtual,
    isScrollAtTop,
    isScrollAtBottom,
    !!scrollWidth,
    onWheelDelta
  )

  // Mobile touch move
  useMobileTouchMove(useVirtual, componentRef, (deltaY, smoothOffset) => {
    if (originScroll(deltaY, smoothOffset)) {
      return false
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onRawWheel({ preventDefault() {}, deltaY } as WheelEvent)
    return true
  })

  useLayoutEffect(() => {
    // Firefox only
    function onMozMousePixelScroll(e: Event) {
      if (useVirtual) {
        e.preventDefault()
      }
    }

    const componentEle = componentRef.current
    if (componentEle) {
      componentEle.addEventListener("wheel", onRawWheel)
      componentEle.addEventListener("DOMMouseScroll", onFireFoxScroll as any)
      componentEle.addEventListener(
        "MozMousePixelScroll",
        onMozMousePixelScroll
      )
    }

    return () => {
      if (componentEle) {
        componentEle.removeEventListener("wheel", onRawWheel)
        componentEle.removeEventListener(
          "DOMMouseScroll",
          onFireFoxScroll as any
        )
        componentEle.removeEventListener(
          "MozMousePixelScroll",
          onMozMousePixelScroll
        )
      }
    }
  }, [useVirtual])

  // ================================= Ref ==================================
  const delayHideScrollBar = () => {
    verticalScrollBarRef.current?.delayHidden()
    horizontalScrollBarRef.current?.delayHidden()
  }

  const scrollTo = useScrollTo<T>(
    componentRef,
    mergedData,
    heights,
    itemHeight ?? 0,
    getKey,
    collectHeight,
    syncScrollTop,
    delayHideScrollBar
  )

  useImperativeHandle(ref, () => ({
    getScrollInfo: getVirtualScrollInfo,
    scrollTo: (config) => {
      function isPosScroll(arg: any): arg is ScrollPos {
        return (
          !!arg && typeof arg === "object" && ("left" in arg || "top" in arg)
        )
      }

      if (isPosScroll(config)) {
        // Scroll X
        if (config.left !== undefined) {
          setOffsetLeft(keepInHorizontalRange(config.left))
        }

        if (!config.top) return
        // Scroll Y
        scrollTo(config.top)
      } else {
        scrollTo(config)
      }
    },
  }))

  // ================================ Effect ================================
  /** We need told outside that some list not rendered */
  useLayoutEffect(() => {
    if (onVisibleChange) {
      const renderList = mergedData.slice(start, end + 1)

      onVisibleChange(renderList, mergedData)
    }
  }, [start, end, mergedData])

  // ================================ Extra =================================
  const getSize = useGetSize(mergedData, getKey, heights, itemHeight!)

  const extraContent = extraRender?.({
    start,
    end,
    virtual: inVirtual,
    offsetX: offsetLeft,
    offsetY: fillerOffset ?? 0,
    rtl: isRTL,
    getSize,
  })

  // ================================ Render ================================
  const listChildren = useChildren(
    mergedData,
    start,
    end,
    scrollWidth ?? 0,
    setInstanceRef,
    children,
    sharedConfig
  )

  let componentStyle: CSSProperties = {}
  if (height) {
    componentStyle = {
      [fullHeight ? "height" : "maxHeight"]: height,
      ...ScrollStyle,
    }

    if (useVirtual) {
      componentStyle.overflowY = "hidden"

      if (scrollWidth) {
        componentStyle.overflowX = "hidden"
      }

      if (scrollMoving) {
        componentStyle.pointerEvents = "none"
      }
    }
  }

  const containerProps: HTMLAttributes<HTMLDivElement> = {}
  if (isRTL) {
    containerProps.dir = "rtl"
  }

  return (
    <div
      style={{
        ...style,
        position: "relative",
      }}
      className={mergedClassName}
      {...containerProps}
      {...restProps}
    >
      <ResizeObserver onResize={onHolderResize}>
        <Component
          className={`${prefixCls}-holder`}
          style={componentStyle}
          ref={componentRef}
          onScroll={onFallbackScroll}
          onMouseEnter={delayHideScrollBar}
        >
          <Filler
            prefixCls={prefixCls}
            height={scrollHeight ?? 0}
            offsetX={offsetLeft}
            offsetY={fillerOffset}
            scrollWidth={scrollWidth}
            onInnerResize={collectHeight}
            ref={fillerInnerRef}
            innerProps={innerProps}
            rtl={isRTL}
            extra={extraContent}
          >
            {listChildren}
          </Filler>
        </Component>
      </ResizeObserver>

      {inVirtual && scrollHeight && scrollHeight > height && (
        <ScrollBar
          ref={verticalScrollBarRef}
          prefixCls={prefixCls}
          scrollOffset={offsetTop}
          scrollRange={scrollHeight}
          rtl={isRTL}
          onScroll={onScrollBar}
          onStartMove={onScrollbarStartMove}
          onStopMove={onScrollbarStopMove}
          spinSize={verticalScrollBarSpinSize}
          containerSize={size.height}
        />
      )}

      {inVirtual && scrollWidth && (
        <ScrollBar
          ref={horizontalScrollBarRef}
          prefixCls={prefixCls}
          scrollOffset={offsetLeft}
          scrollRange={scrollWidth}
          rtl={isRTL}
          onScroll={onScrollBar}
          onStartMove={onScrollbarStartMove}
          onStopMove={onScrollbarStopMove}
          spinSize={horizontalScrollBarSpinSize}
          containerSize={size.width}
          horizontal
        />
      )}
    </div>
  )
}

export const List = forwardRef<ListRef, ListProps<any>>(RawList)

List.displayName = "List"
