"use client"

import { IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react"
import {
  type FC,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { cl } from "~/common/utils"
import { Button } from "~/ui/Button"

interface ResizeProps {
  firstElement: ReactElement
  secondElement: ReactElement
  showTitle?: string
}

export const Resize: FC<ResizeProps> = ({
  firstElement,
  secondElement,
  showTitle,
}) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(400)
  const [isCollapseSidebar, setIsCollapseSidebar] = useState(false)

  const startResizing = useCallback(() => {
    setIsResizing(true)
  }, [])

  const stopResizing = useCallback(() => {
    setIsResizing(false)
  }, [])

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        setSidebarWidth(
          mouseMoveEvent.clientX -
            sidebarRef.current.getBoundingClientRect().left
        )
      }
    },
    [isResizing]
  )

  useEffect(() => {
    window.addEventListener("mousemove", resize)
    window.addEventListener("mouseup", stopResizing)
    return () => {
      window.removeEventListener("mousemove", resize)
      window.removeEventListener("mouseup", stopResizing)
    }
  }, [resize, stopResizing])

  return (
    <div className="flex flex-grow h-full">
      <div
        ref={sidebarRef}
        className={cl(
          "relative group shrink-0 border-r shadow-[inset_-88px_0px_13px_-88px_rgba(0,0,0,0.1)]",
          {
            hidden: isCollapseSidebar,
          }
        )}
        style={{ width: sidebarWidth }}
      >
        {firstElement}
        <div
          className="w-2.5 h-full absolute -right-1.5 inset-y-0 cursor-col-resize"
          onMouseDown={startResizing}
        />
        <Button
          className="absolute border-0 hover:bg-neutral-100 inline-flex justify-center items-center right-5 bottom-7 px-1 py-1 invisible group-hover:visible"
          size="sm"
          onClick={() => setIsCollapseSidebar(true)}
          prefix={<IconChevronsLeft className="h-5 w-5 pl-1 bg-transparent" />}
        ></Button>
      </div>

      <div
        className="w-full relative h-[calc(100vh-40px)]"
        onMouseMove={(e) => {
          isResizing && e.preventDefault()
        }}
      >
        {secondElement}
        <Button
          size="sm"
          className={cl("absolute bottom-7 left-3 hidden", {
            "inline-block": isCollapseSidebar,
          })}
          onClick={() => setIsCollapseSidebar(false)}
          prefix={<IconChevronsRight className="h-5 w-5" />}
        >
          {showTitle}
        </Button>
      </div>
    </div>
  )
}
