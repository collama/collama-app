import {
  forwardRef,
  type Key,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { NoticeList } from "~/ui/Notification/components/NoticeList"
import { type OpenConfig, type Placement } from "~/ui/Notification/interface"

type Placements = Partial<Record<Placement, OpenConfig[]>>

export interface NotificationsRef {
  open: (config: OpenConfig) => void
  close: (key: Key) => void
  destroy: () => void
}

export interface NotificationsProps {
  container?: HTMLElement | ShadowRoot
  maxCount?: number
}

export const Notifications = forwardRef<NotificationsRef, NotificationsProps>(
  function Notifications({ container, maxCount }, ref) {
    const [configs, setConfigs] = useState<OpenConfig[]>([])
    const [placements, setPlacements] = useState<Placements>({})

    const onNoticeClose = (key: Key) => {
      const config = configs.find((config) => config.key === key)
      config?.onClose?.()

      setConfigs((configs) => configs.filter((config) => config.key !== key))
    }

    useEffect(() => {
      const nextPlacements: Placements = {}
      configs.forEach((config) => {
        const { placement = "topRight" } = config

        if (placement) {
          nextPlacements[placement] = nextPlacements[placement] || []
          nextPlacements[placement].push(config)
        }
      })

      // Fill exist placements to avoid empty list causing remove without motion
      const placementKeys = Object.keys(placements) as Placement[]
      placementKeys.forEach((placement) => {
        nextPlacements[placement] = nextPlacements[placement] || []
      })

      setPlacements(nextPlacements)
    }, [configs.length])

    useImperativeHandle(ref, () => ({
      open: (openConfig) => {
        setConfigs((config) => {
          const clone = [...config]
          const index = clone.findIndex((item) => item.key === openConfig.key)

          if (index >= 0) {
            clone[index] = openConfig
          } else {
            clone.push(openConfig)
          }

          if (maxCount && maxCount > 0 && clone.length > maxCount) {
            clone.slice(-maxCount)
          }

          return clone
        })
      },
      close: (key) => onNoticeClose(key),
      destroy: () => setConfigs([]),
    }))

    if (!container) {
      return null
    }
    const placementList = Object.keys(placements) as Placement[]

    return createPortal(
      <>
        {placementList.map((placement) => {
          const placementConfigList = placements[placement]

          return (
            <NoticeList
              configList={placementConfigList}
              placement={placement}
              onNoticeClose={onNoticeClose}
              key={placement}
            />
          )
        })}
      </>,
      container
    )
  }
)
