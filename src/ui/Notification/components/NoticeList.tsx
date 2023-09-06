import type { FC, Key } from "react"
import { Notice } from "~/ui/Notification/components/Notice"
import type { OpenConfig, Placement } from "~/ui/Notification/interface"
import cx from "classnames"

interface NoticeListProps {
  configList?: OpenConfig[]
  placement?: Placement
  onNoticeClose?: (key: Key) => void
}

const placementClass: Record<Placement, string> = {
  top: "flex-col top-6 right-0",
  topRight: "flex-col top-6 right-0",
  topLeft: "flex-col top-6 left-0",
  bottom: "flex-col bottom-6",
  bottomRight: "flex-col bottom-6 right-0",
  bottomLeft: "flex-col bottom-6 left-0",
}

export const NoticeList: FC<NoticeListProps & { placement: Placement }> = ({
  configList,
  onNoticeClose,
  placement,
}) => {
  return (
    <div
      className={cx(
        "fixed z-[1000] me-6 mt-0 box-border list-none p-0 text-base ",
        placementClass[placement]
      )}
    >
      {configList?.map(({ key, ...config }) => {
        return (
          <Notice
            key={key}
            {...config}
            onNoticeClose={onNoticeClose}
            eventKey={key}
          />
        )
      })}
    </div>
  )
}
