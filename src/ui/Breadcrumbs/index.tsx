import { type FC, type ReactNode } from "react"
import Link from "next/link"
import urlJoin from "url-join";

export type CrumbItem = {
  label: ReactNode // e.g., Python
  path: string // e.g., /development/programming-languages/python
}

interface BreadcrumbsProps {
  items: CrumbItem[]
}

export const Breadcrumbs: FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <div className="flex items-start gap-2">
      {items.map((crumb, i) => {
        const isLastItem = i === items.length - 1
        if (!isLastItem) {
          return (
            <span className='text-neutral-400 ' key={i}>
              <Link
                href={urlJoin('/', crumb.path)}

                className="hover:text-neutral-600 hover:underline"
              >
                {crumb.label}
              </Link>
              {/* separator */}
              <span> / </span>
            </span>
          )
        } else {
          return <span key={crumb.path} className='cursor-default'>{crumb.label}</span>
        }
      })}
    </div>
  )
}
