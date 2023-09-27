import {
  IconAlertTriangleFilled,
  IconCircleCheckFilled,
  IconHelpCircleFilled,
  IconInfoCircleFilled,
  IconX,
  type TablerIconsProps,
} from "@tabler/icons-react"
import cx from "classnames"
import { forwardRef, type Key, useCallback, useEffect, useState } from "react"
import {
  type NoticeConfig,
  type NotifyStatus,
} from "~/ui/Notification/interface"

interface NoticeProps extends Omit<NoticeConfig, "onClose"> {
  eventKey: Key
  onNoticeClose?: (key: Key) => void
}

const statusIcon: Record<
  NotifyStatus,
  (props: TablerIconsProps) => JSX.Element
> = {
  info: IconInfoCircleFilled,
  error: IconAlertTriangleFilled,
  success: IconCircleCheckFilled,
  warning: IconHelpCircleFilled,
}

const statusClassname: Record<NotifyStatus, string> = {
  info: "text-blue-600",
  warning: "text-yellow-600",
  success: "text-green-600",
  error: "text-red-600",
}

const renderIcon = (status: NotifyStatus) => {
  const Icon = statusIcon[status]

  return <Icon />
}

export const Notice = forwardRef<HTMLDivElement, NoticeProps>(function Notice(
  {
    content,
    onNoticeClose,
    eventKey,
    onClick,
    status,
    closable = true,
    duration = 4.5,
  },
  ref
) {
  const [hovering, setHovering] = useState(false)

  const onInternalClose = useCallback(() => {
    onNoticeClose?.(eventKey)
  }, [onNoticeClose, eventKey])

  useEffect(() => {
    if (!hovering && duration && duration > 0) {
      const timeout = setTimeout(() => {
        onInternalClose()
      }, duration * 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [duration, hovering])

  return (
    <div
      className="relative z-[1000] mb-4 box-border w-[385px] max-w-[calc(100vw-48px)] overflow-hidden break-words rounded-lg bg-white px-6 py-5 text-base shadow-notification"
      ref={ref}
      onMouseEnter={() => {
        setHovering(true)
      }}
      onMouseLeave={() => {
        setHovering(false)
      }}
      onClick={onClick}
    >
      {status && (
        <span
          className={cx(
            "absolute start-6 top-5 flex h-6 w-6 items-center justify-center rounded outline-0 transition-all",
            statusClassname[status]
          )}
        >
          {renderIcon(status)}
        </span>
      )}
      <div
        className={cx("mb-2 break-words pe-6 text-base font-medium", {
          "ms-9": status,
        })}
      >
        {content?.message}
      </div>
      {content?.description && (
        <div
          className={cx("break-words text-base text-neutral-500", {
            "ms-9": status,
          })}
        >
          {content.description}
        </div>
      )}
      {closable && (
        <span
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onInternalClose()
          }}
          className="absolute end-6 top-5 flex h-5 w-5 items-center justify-center rounded text-neutral-500 outline-0 transition-all hover:rounded-full hover:bg-gray-200 hover:text-black"
        >
          <IconX />
        </span>
      )}
    </div>
  )
})
