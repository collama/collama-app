import type { Key, MouseEventHandler, ReactNode } from "react"

export type Placement =
  | "top"
  | "topLeft"
  | "topRight"
  | "bottom"
  | "bottomLeft"
  | "bottomRight"

type Content = {
  message?: string
  description?: string
}

export type NotifyStatus = "success" | "error" | "info" | "warning"

export interface NoticeConfig {
  status?: NotifyStatus
  content?: Content
  duration?: number | null
  closeIcon?: ReactNode
  closable?: boolean
  onClose?: VoidFunction
  onClick?: MouseEventHandler<HTMLDivElement>
}

export interface OpenConfig extends NoticeConfig {
  key: Key
  placement?: Placement
  duration?: number | null
}

type OptionalConfig = Partial<OpenConfig>

export interface NotificationAPI {
  open: (config: OptionalConfig) => void
  close: (key: Key) => void
  destroy: () => void
}
interface OpenTask {
  type: "open"
  config: OpenConfig
}

interface CloseTask {
  type: "close"
  key: Key
}

interface DestroyTask {
  type: "destroy"
}

export type Task = OpenTask | CloseTask | DestroyTask
