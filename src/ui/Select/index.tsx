"use client"

import { Listbox } from "@headlessui/react"
import { IconSelector } from "@tabler/icons-react"
import { forwardRef, useEffect, useMemo, useState } from "react"
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
  iconClassname?: string
  optionClassname?: string
  placeholder?: string
  disabled?: boolean
}

const getInitValue = (
  options: SelectOption[],
  placeholder: string,
  defaultValue?: SelectValue
): SelectOption => {
  let select: SelectOption = { label: placeholder, value: "" }

  if (defaultValue) {
    const res = defaultValue

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
      iconClassname,
      optionClassname,
      placeholder = "Select ...",
      disabled = false,
    },
    ref
  ) {
    const transformOptions = useMemo(() => {
      return options.map((option) => {
        if (option?.label) {
          return option
        }

        return { ...option, label: option.value }
      })
    }, [])

    const [selected, setSelected] = useState<SelectOption>(
      getInitValue(transformOptions, placeholder, defaultValue)
    )

    useEffect(() => {
      if (value && value !== selected.value) {
        const valueInOpt = transformOptions.find(
          (option) => option.value === value
        )
        if (!valueInOpt) return

        setSelected(valueInOpt)
      }
    }, [value])

    if (!transformOptions) return

    const handleChange = (selected: SelectOption) => {
      setSelected(selected)
      onChange?.(selected.value, selected)
    }

    return (
      <Listbox value={selected} onChange={handleChange} disabled={disabled}>
        {({ open }) => (
          <div className={cl("relative", warrperClassname)}>
            <Listbox.Button
              className={cl(
                "relative flex w-full justify-between items-center min-w-[80px] cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border disabled:bg-gray-100",
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
              <IconSelector className={cl("h-4 w-4", iconClassname)} />
            </Listbox.Button>
            <Listbox.Options
              className={cl(
                "z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                popupClassname
              )}
            >
              {transformOptions.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    cl(
                      "relative cursor-default select-none px-3 py-1.5 text-gray-900",
                      {
                        "bg-neutral-100": active,
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
        )}
      </Listbox>
    )
  }
)
