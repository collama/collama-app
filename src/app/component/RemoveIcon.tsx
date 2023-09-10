import { IconX } from "@tabler/icons-react"

interface Props {
  onClick: VoidFunction
}
export function RemoveIcon({ onClick }: Props) {
  return (
    <span onClick={onClick} className="table-icon">
      {<IconX />}
    </span>
  )
}
