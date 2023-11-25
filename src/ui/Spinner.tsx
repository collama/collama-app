import { cl } from "~/common/utils"

type Size = "base" | "lg" | "xl"

const SIZE: Record<Size, string> = {
  base: "h-4 w-4",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
}

interface SpinProps {
  className?: string
  size?: Size
}

export const Spin = ({ className, size = "base" }: SpinProps) => (
  <div
    className={cl(
      "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-violet-500",
      SIZE[size],
      className
    )}
    role="status"
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
)
