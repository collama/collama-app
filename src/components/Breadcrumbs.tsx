"use client"

import { useParams, usePathname } from "next/navigation"
import { Breadcrumbs as UiBreadcrumbs, type CrumbItem } from "~/ui/Breadcrumbs"
import { capitalizeFirstLetter } from "~/common/utils"

const parsePathname = (pathname: string) => {
  const paths = pathname.split("/")
  return paths.length <= 1 ? null : paths.slice(1)
}

const transformToCrumbItem = (items: string[]) => {
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
    <div className="px-4 py-2 shadow bg-white">
      <UiBreadcrumbs items={items} />
    </div>
  )
}
