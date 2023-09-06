import {
  type ReactElement,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  type NotificationAPI,
  type NotifyStatus,
  type Placement,
  type Task,
} from "./interface"
import {
  Notifications,
  type NotificationsRef,
} from "./components/Notifications"
import { defaultGetContainer, mergeConfig } from "~/ui/Notification/ultis"

type NotificationConfig = {
  closeIcon?: ReactNode
  closable?: boolean
  maxCount?: number
  duration?: number
  status?: NotifyStatus
  placement?: Placement
}

let uniqueKey = 0

export const useNotification = (
  config: NotificationConfig = {}
): [NotificationAPI, ReactElement] => {
  const { maxCount, ...shareConfig } = config

  const [container, setContainer] = useState<HTMLElement | ShadowRoot>()
  const [tasks, setTasks] = useState<Task[]>([])
  const notificationsRef = useRef<NotificationsRef>(null)

  const contextHolder = (
    <Notifications
      ref={notificationsRef}
      container={container}
      maxCount={maxCount}
    />
  )

  const api = useMemo<NotificationAPI>(() => {
    return {
      open: (config) => {
        const mergedConfig = mergeConfig(shareConfig, config)
        if (mergedConfig.key === null || mergedConfig.key === undefined) {
          mergedConfig.key = uniqueKey
          uniqueKey += 1
        }

        setTasks((task) => [...task, { type: "open", config: mergedConfig }])
      },
      close: (key) => {
        setTasks((task) => [...task, { type: "close", key }])
      },
      destroy: () => {
        setTasks((task) => [...task, { type: "destroy" }])
      },
    }
  }, [shareConfig])

  useEffect(() => {
    setContainer(defaultGetContainer())
  }, [])

  useEffect(() => {
    if (!!notificationsRef.current && tasks.length >= 0) {
      tasks.forEach((task) => {
        switch (task.type) {
          case "open":
            return notificationsRef.current?.open(task.config)

          case "close":
            return notificationsRef.current?.close(task.key)

          case "destroy":
            return notificationsRef.current?.destroy()
        }
      })

      // React 17 will mix order of effect & setState in async
      // - open: setState[0]
      // - effect[0]
      // - open: setState[1]
      // - effect setState([]) * here will clean up [0, 1] in React 17
      setTasks((oriQueue) => oriQueue.filter((task) => !tasks.includes(task)))
    }
  }, [tasks.length])

  return [api, contextHolder]
}
