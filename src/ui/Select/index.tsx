"use client"

import { Listbox } from "@headlessui/react"
import { forwardRef, useState } from "react"
import { cl } from "~/common/utils"

export interface SelectOption {
  value: string
  label?: string
}

type SelectValue = SelectOption | SelectOption["value"]

type SelectSize = "sm" | "base" | "lg" | "xl"

const BASE_SIZE: Record<SelectSize, string> = {
  sm: "text-sm py-0 px-2",
  base: "text-base px-2 py-1",
  lg: "text-lg py-3",
  xl: "text-xl py-5",
}

type SelectProps = {
  options: SelectOption[]
  defaultValue?: SelectValue
  size?: SelectSize
  value?: SelectValue
  onChange?: (value: string, selected: SelectOption) => void
  className?: string
  warrperClassname?: string
  popupClassname?: string
  optionClassname?: string
  placeholder?: string
  disabled?: boolean
}

const getInitValue = (
  options: SelectOption[],
  placeholder: string,
  value?: SelectValue,
  defaultValue?: SelectValue
): SelectOption => {
  let select: SelectOption = { label: placeholder, value: "" }

  if (value || defaultValue) {
    const res = value ? value : defaultValue

    if (res instanceof Object) {
      return res
    }

    const optionValue = options.find((option) => option.value === res)

    if (optionValue) select = optionValue
  }

  return select
}

export const Select = forwardRef<HTMLButtonElement | null, SelectProps>(
  function Select(
    {
      options,
      onChange,
      value,
      defaultValue,
      size = "base",
      className,
      warrperClassname,
      popupClassname,
      optionClassname,
      placeholder = "Select ...",
      disabled = false,
    },
    ref
  ) {
    const [selected, setSelected] = useState<SelectOption>(
      getInitValue(options, placeholder, value, defaultValue)
    )

    if (!options || options.length < 1) return

    const handleChange = (selected: SelectOption) => {
      setSelected(selected)
      onChange?.(selected.value, selected)
    }

    return (
      <Listbox value={selected} onChange={handleChange} disabled={disabled}>
        <div className={cl("relative", warrperClassname)}>
          <Listbox.Button
            className={cl(
              "relative w-full min-w-[80px] cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 disabled:bg-gray-100",
              BASE_SIZE[size],
              { "cursor-not-allowed bg-gray-100 text-gray-300": disabled },
              className
            )}
          >
            <span
              className={cl("truncate", {
                "text-neutral-400": selected.label === placeholder,
              })}
            >
              {selected.label}
            </span>
          </Listbox.Button>
          <Listbox.Options
            className={cl(
              "z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
              popupClassname
            )}
          >
            {options.map((option, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  cl(
                    "relative cursor-default select-none pl-3 text-gray-900",
                    {
                      "text-primary-1": active,
                    },
                    optionClassname
                  )
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-bold" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    )
  }
)
