"use client"

import { useRef, useState } from "react"
import { IconSelector, IconSettings2 } from "@tabler/icons-react"
import { useClickAway } from "react-use"
import Avatar from "~/app/(protected)/[workspace]/components/Avatar"

export const NavHeader = () => {
  const [opened, setOpened] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useClickAway(ref, () => {
    setOpened(false)
  })

  return (
    <div className="flex relative w-full cursor-pointer">
      <div
        className="flex w-full flex-row items-center border-b p-2"
        onClick={() => setOpened((prevState) => !prevState)}
      >
        <div className="flex w-full flex-row items-center p-2 hover:bg-gray-200 rounded-lg transition ease-in-out delay-150">
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
          className="absolute top-[60px] left-[15px] bg-white border rounded-lg w-[300px]"
        >
          <div className="border-b p-2">
            <div className="flex w-full flex-row items-center p-2 hover:bg-gray-100 rounded-lg transition ease-in-out delay-50">
              <Avatar character="P" color="green" />
              <div className="ml-1.5 text-sm font-medium">Techcombank</div>
            </div>
            <div className="flex w-full flex-row items-center p-2 hover:bg-gray-100 rounded-lg transition ease-in-out delay-50">
              <Avatar character="A" color="red" />
              <div className="ml-1.5 text-sm font-medium">Ahamove</div>
            </div>
            <div className="flex w-full flex-row items-center p-2 hover:bg-gray-100 rounded-lg transition ease-in-out delay-50">
              <Avatar character="W" color="sky" />
              <div className="ml-1.5 text-sm font-medium">Woven</div>
            </div>
          </div>

          <div className="border-b">
            <div className="font-medium text-xs px-4 pt-2 flex flex-row items-center">
              <span>linrium@gmail.com</span>
              <div className="bg-green-100 text-green-500 ml-auto p-1 rounded text-xs">
                <span>Premium</span>
              </div>
            </div>
            <div className="p-2">
              <div className="flex w-full flex-row items-center p-2 hover:bg-gray-100 rounded-lg transition ease-in-out delay-50">
                <IconSettings2 size={18} color="#4b5563" />
                <span className="text-sm ml-1.5">Account settings</span>
              </div>
            </div>
          </div>

          <div>
            <div className="p-2">
              <div className="flex w-full flex-row items-center p-2 hover:bg-gray-100 rounded-lg transition ease-in-out delay-50">
                <span className="text-sm text-red-500">Sign out</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
