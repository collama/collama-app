"use client"

import { Disclosure as HeadlessDisclosure } from "@headlessui/react"
import { IconChevronUp } from "@tabler/icons-react"
import { type FC, type ReactNode } from "react"

type DisclosureItem = {
  label: string
  children: ReactNode
}

interface DisclosureProps {
  items: DisclosureItem[]
}

export const Disclosure: FC<DisclosureProps> = ({ items }) => {
  return (
    <div>
      {items.map((item, index) => (
        <HeadlessDisclosure defaultOpen key={index}>
          {({ open }) => (
            <>
              <HeadlessDisclosure.Button className="flex w-full justify-between px-4 py-2 hover:bg-neutral-100 text-left font-medium ">
                {item.label}
                <IconChevronUp
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-4 w-4`}
                />
              </HeadlessDisclosure.Button>
              <HeadlessDisclosure.Panel
                unmount={false}
                className="text-gray-500"
              >
                {item.children}
              </HeadlessDisclosure.Panel>
            </>
          )}
        </HeadlessDisclosure>
      ))}
    </div>
  )
}
