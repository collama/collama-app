import Image from "next/image"
import Link from "next/link"

export const Heading = () => {
  return (
    <Link className=" flex items-center justify-center px-2" href="/">
      <Image
        width={120}
        height={100}
        alt="collama-icon"
        src="/collama-icon.png"
        className="aspect-video"
      />
    </Link>
  )
}
