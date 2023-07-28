"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  autoUpdate,
  FloatingList,
  flip,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
  FloatingFocusManager,
  useListItem,
} from "@floating-ui/react"
import { type UseFormRegisterReturn } from "react-hook-form"
import cx from "classnames"

export interface SelectOption {
  value: string
  label?: string
}

type SelectProps = {
  options: SelectOption[]
  width?: number
  popupHeight?: number
  form?: UseFormRegisterReturn<string>
  defaultValue?: SelectOption
}

interface SelectContextValue {
  activeIndex: number | null
  selectedIndex: number | null
  getItemProps: ReturnType<typeof useInteractions>["getItemProps"]
  handleSelect: (index: number | null) => void
}

const SelectContext = createContext<SelectContextValue>(
  {} as SelectContextValue
)

export function Select({
  options,
  width = 200,
  popupHeight = 250,
  form,
  defaultValue,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [selectedLabel, setSelectedLabel] = useState<string | null | undefined>(
    defaultValue?.value
  )

  const { refs, floatingStyles, context } = useFloating({
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [flip()],
  })

  const elementsRef = useRef<Array<HTMLElement | null>>([])
  const labelsRef = useRef<Array<string | null>>([])

  const handleSelect = useCallback((index: number | null) => {
    setSelectedIndex(index)
    setIsOpen(false)
    if (index !== null) {
      setSelectedLabel(labelsRef.current[index])
    }
  }, [])

  function handleTypeaheadMatch(index: number | null) {
    if (isOpen) {
      setActiveIndex(index)
    } else {
      handleSelect(index)
    }
  }

  const listNav = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
  })
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch: handleTypeaheadMatch,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: "listbox" })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [listNav, typeahead, click, dismiss, role]
  )

  const selectContext = useMemo(
    () => ({
      activeIndex,
      selectedIndex,
      getItemProps,
      handleSelect,
    }),
    [activeIndex, selectedIndex, getItemProps, handleSelect]
  )

  return (
    <div>
      <input
        tabIndex={0}
        {...getReferenceProps()}
        value={selectedLabel ?? ""}
        placeholder="Select ..."
        style={{ width, maxHeight: popupHeight }}
        className="border rounded px-2"
        {...form}
        ref={(ref) => {
          refs.setReference(ref)
          form && form.ref(ref)
        }}
      />
      <SelectContext.Provider value={selectContext}>
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={{ ...floatingStyles, width }}
              {...getFloatingProps()}
              className="relative z-50 max-h-[200px] overflow-y-auto"
            >
              <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
                {options.map((option, index) => (
                  <Option
                    label={option.label}
                    value={option.value}
                    key={index}
                  />
                ))}
              </FloatingList>
            </div>
          </FloatingFocusManager>
        )}
      </SelectContext.Provider>
    </div>
  )
}

function Option({ label, value }: SelectOption) {
  const { activeIndex, selectedIndex, getItemProps, handleSelect } =
    useContext(SelectContext)

  const { ref, index } = useListItem({ label: value })

  const isActive = activeIndex === index
  const isSelected = selectedIndex === index

  return (
    <button
      ref={ref}
      role="option"
      aria-selected={isActive && isSelected}
      tabIndex={isActive ? 0 : -1}
      {...getItemProps({
        onClick: () => handleSelect(index),
      })}
      className={cx(
        "block border bg-yellow-100 w-full text-start truncate",
        { "bg-violet-100": isActive },
        { "bg-yellow-200": isSelected }
      )}
    >
      {label ?? value}
    </button>
  )
}
