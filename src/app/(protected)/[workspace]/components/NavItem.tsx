import Link from "next/link"

interface NavItemProps {
  href: string
  title: string
  icon: React.ReactNode
}

export default function NavItem(props: NavItemProps) {
  return (
    <div className="py-2 px-4">
      <Link href={props.href} className="flex items-center">
        {props.icon}
        <span className="ml-1.5 text-sm font-medium text-gray-600">
          {props.title}
        </span>
      </Link>
    </div>
  )
}
