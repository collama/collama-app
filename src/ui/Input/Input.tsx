import cx from "classnames"

export interface InputProps {
  primary: boolean
}

export default function Input({ primary }: InputProps) {
  return (
    <div
      className={cx("p-4", {
        "bg-red-500": primary,
      })}
    >
      <input className="border p-4" type="text" />
    </div>
  )
}
