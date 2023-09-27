"use client"

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  offset,
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
import cx from "classnames"
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import { type ControllerRenderProps } from "react-hook-form"
import { noop } from "~/common/utils"
import { Input } from "~/ui/Input"

export interface SelectOption {
  value: string
  label?: string
}

type SelectProps = {
  options: SelectOption[]
  width?: number
  popupHeight?: number
  defaultValue?: string | SelectOption
  defaultOpen?: boolean
  disabled?: boolean
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
    >(typeof defaultValue === "string" ? defaultValue : defaultValue?.value)

    const { refs, floatingStyles, context } = useFloating({
      placement: "bottom-start",
      open: isOpen,
      onOpenChange: setIsOpen,
      whileElementsMounted: autoUpdate,
      middleware: [flip(), offset(5)],
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
          className="cursor-pointer px-2"
          ref={useMergeRefs([refs.setReference, ref])}
          onChange={noop}
        />
        <SelectContext.Provider value={selectContext}>
          {isOpen && (
            <FloatingFocusManager context={context} modal={false}>
              <div
                ref={refs.setFloating}
                style={{ ...floatingStyles, width }}
                {...getFloatingProps()}
                className="relative z-[1000] rounded-lg max-h-[200px] overflow-y-auto bg-white p-1 shadow-card outline-0 border-0"
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

  const classes = cx(
    "block rounded-lg w-full truncate bg-white text-start px-2 py-1 border-0 outline-0",
    { "!bg-violet-100": isSelected },
    { "!bg-neutral-100": isActive && !isSelected }
  )

  return (
    <button
      ref={ref}
      role="option"
      aria-selected={isActive && isSelected}
      tabIndex={isActive ? 0 : -1}
      {...getItemProps({
        onClick: () => handleSelect(index),
      })}
      className={classes}
    >
      {label ?? value}
    </button>
  )
}
