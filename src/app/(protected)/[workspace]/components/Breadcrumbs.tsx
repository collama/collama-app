"use client"

import { usePathname } from "next/navigation"
import { Breadcrumbs as UiBreadcrumbs, type CrumbItem } from "~/ui/Breadcrumbs"
import { capitalizeFirstLetter } from "~/common/utils"

const parsePathname = (pathname: string) => {
  const paths = pathname.split("/")
  return paths.length <= 1 ? null : paths.slice(1)
}

const unUsePath = ["teams", "tasks"]

const removeUnUsePath = (paths: string[]) =>
  paths.filter((path) => !unUsePath.includes(path))

const transformToCrumbItem = (paths: string[]) => {
  const items = removeUnUsePath(paths)

  return items.map<CrumbItem>((item, index) => {
    if (index === 0) {
      return {
        label: "Workspace",
        path: item,
      }
    }

    return {
      label: capitalizeFirstLetter(item),
      path: item,
    }
  })
}

export const Breadcrumbs = () => {
  const pathname = usePathname()

  const paths = parsePathname(pathname)

  if (!paths) return null

  const items = transformToCrumbItem(paths)

  return (
    <div className="bg-white px-4 py-2 shadow">
      <UiBreadcrumbs items={items} />
    </div>
  )
}
