import cx from "classnames"

interface SpinProps {
  className: string
}

export const Spin = ({ className }: SpinProps) => (
  <div
    className={cx(
      "inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-violet-500",
      className
    )}
    role="status"
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
)
