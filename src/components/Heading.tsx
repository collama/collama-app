import Link from "next/link"

export const Heading = () => {
  return (
    <div className="px-4 py-6">
      <Link href="/">
        <div>
          <h1>Collama</h1>
        </div>
      </Link>
    </div>
  )
}
