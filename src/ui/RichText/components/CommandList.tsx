import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight
  const itemHeight = item ? item.offsetHeight : 0

  const top = item.offsetTop
  const bottom = top + itemHeight

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5
  }
}

export enum Key {
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  Enter = "Enter",
  Escape = "Escape",
}

interface CommandItemProps {
  title: string
}

export interface CommandListProps {
  items: CommandItemProps[]
  command: (props: CommandItemProps) => void
}

export const CommandList = ({ items, command }: CommandListProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index]
      if (item) {
        command(item)
      }
    },
    [command, items]
  )

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): boolean => {
      e.preventDefault()

      const key = e.key as Key
      if (key === Key.ArrowUp) {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length)
        return true
      }

      if (key === Key.ArrowDown) {
        setSelectedIndex((selectedIndex + 1) % items.length)
        return true
      }

      if (key === Key.Enter) {
        selectItem(selectedIndex)
        return true
      }

      return false
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [items, selectedIndex, setSelectedIndex, selectItem])

  const commandListContainer = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const container = commandListContainer?.current
    const item = container?.children[selectedIndex] as HTMLElement

    if (item && container) updateScrollView(container, item)
  }, [selectedIndex])

  return items.length > 0 ? (
    <div
      id="slash-command"
      ref={commandListContainer}
      className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all"
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 ${
              index === selectedIndex ? "bg-stone-100 text-stone-900" : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <p className="font-medium">{item.title}</p>
          </button>
        )
      })}
    </div>
  ) : null
}
