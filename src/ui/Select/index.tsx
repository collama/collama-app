"use client"

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useRole,
  useTypeahead,
} from "@floating-ui/react"
import { type ControllerRenderProps } from "react-hook-form"
import cx from "classnames"
import { noop } from "~/common/utils"
import { Input } from "~/ui/input"

export interface SelectOption {
  value: string
  label?: string
}

type SelectProps = {
  options: SelectOption[]
  width?: number
  popupHeight?: number
  defaultValue?: SelectOption
  defaultOpen?: boolean
} & Partial<ControllerRenderProps>

interface SelectContextValue {
  activeIndex: number | null
  selectedIndex: number | null
  getItemProps: ReturnType<typeof useInteractions>["getItemProps"]
  handleSelect: (index: number | null) => void
}

const SelectContext = createContext<SelectContextValue>(
  {} as SelectContextValue
)

export const Select = forwardRef<HTMLInputElement | null, SelectProps>(
  function Select(
    {
      options,
      width = 200,
      popupHeight = 250,
      defaultValue,
      onChange,
      defaultOpen = false,
      ...props
    },
    ref
  ) {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [selectedLabel, setSelectedLabel] = useState<
      string | null | undefined
    >(defaultValue?.value)

    const { refs, floatingStyles, context } = useFloating({
      placement: "bottom-start",
      open: isOpen,
      onOpenChange: setIsOpen,
      whileElementsMounted: autoUpdate,
      middleware: [flip()],
    })

    const elementsRef = useRef<Array<HTMLElement | null>>([])
    const labelsRef = useRef<Array<string | null>>([])

    const handleSelect = useCallback(
      (index: number | null) => {
        setSelectedIndex(index)
        setIsOpen(false)
        if (index !== null) {
          setSelectedLabel(labelsRef.current[index])
          onChange?.(labelsRef.current[index])
        }
      },
      [onChange]
    )

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

    const { getReferenceProps, getFloatingProps, getItemProps } =
      useInteractions([listNav, typeahead, click, dismiss, role])

    const selectContext = useMemo(
      () => ({
        activeIndex,
        selectedIndex,
        getItemProps,
        handleSelect,
      }),
      [activeIndex, selectedIndex, getItemProps, handleSelect]
    )

    const selectLabel = options.reduce<Record<string, string>>((prev, cur) => {
      prev[cur.value] = cur.label ?? cur.value
      return prev
    }, {})

    return (
      <div>
        <Input
          {...props}
          tabIndex={0}
          {...getReferenceProps()}
          value={selectLabel[selectedLabel ?? ""]}
          placeholder="Select ..."
          style={{ width, maxHeight: popupHeight }}
          className="rounded border px-2"
          ref={useMergeRefs([refs.setReference, ref])}
          size="sm"
          onChange={noop}
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
)

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
        "block w-full truncate border bg-yellow-100 text-start",
        { "bg-violet-100": isActive },
        { "bg-yellow-200": isSelected }
      )}
    >
      {label ?? value}
    </button>
  )
}
