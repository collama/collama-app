"use client"

import { IconSelector, IconSettings2 } from "@tabler/icons-react"
import { useRef, useState } from "react"
import { useClickAway } from "react-use"
import Avatar from "~/app/(protected)/[workspace]/components/Avatar"

export const NavHeader = () => {
  const [opened, setOpened] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickAway(ref, () => {
    setOpened(false)
  })

  return (
    <div className="relative flex w-full cursor-pointer">
      <div
        className="flex w-full flex-row items-center border-b p-2"
        onClick={() => setOpened((prevState) => !prevState)}
      >
        <div className="flex w-full flex-row items-center rounded-lg p-2 transition delay-150 ease-in-out hover:bg-gray-200">
          <Avatar character="P" color="green" />
          <div className="ml-1.5 text-sm font-medium">Personal</div>
          <div className="ml-auto">
            <IconSelector size={18} color="#4b5563" />
          </div>
        </div>
      </div>
      {opened && (
        <div
          ref={ref}
          className="absolute left-[15px] top-[60px] w-[300px] rounded-lg border bg-white"
        >
          <div className="border-b p-2">
            <div className="delay-50 flex w-full flex-row items-center rounded-lg p-2 transition ease-in-out hover:bg-gray-100">
              <Avatar character="P" color="green" />
              <div className="ml-1.5 text-sm font-medium">Techcombank</div>
            </div>
            <div className="delay-50 flex w-full flex-row items-center rounded-lg p-2 transition ease-in-out hover:bg-gray-100">
              <Avatar character="A" color="red" />
              <div className="ml-1.5 text-sm font-medium">Ahamove</div>
            </div>
            <div className="delay-50 flex w-full flex-row items-center rounded-lg p-2 transition ease-in-out hover:bg-gray-100">
              <Avatar character="W" color="sky" />
              <div className="ml-1.5 text-sm font-medium">Woven</div>
            </div>
          </div>

          <div className="border-b">
            <div className="flex flex-row items-center px-4 pt-2 text-xs font-medium">
              <span>linrium@gmail.com</span>
              <div className="ml-auto rounded bg-green-100 p-1 text-xs text-green-500">
                <span>Premium</span>
              </div>
            </div>
            <div className="p-2">
              <div className="delay-50 flex w-full flex-row items-center rounded-lg p-2 transition ease-in-out hover:bg-gray-100">
                <IconSettings2 size={18} color="#4b5563" />
                <span className="ml-1.5 text-sm">Account settings</span>
              </div>
            </div>
          </div>

          <div>
            <div className="p-2">
              <div className="delay-50 flex w-full flex-row items-center rounded-lg p-2 transition ease-in-out hover:bg-gray-100">
                <span className="text-sm text-red-500">Sign out</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
