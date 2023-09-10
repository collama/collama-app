import { IconX } from "@tabler/icons-react"

interface Props {
  onClick: VoidFunction
}
function RemoveButton({ onClick }: Props) {
  return (
    <span onClick={onClick} className="table-icon">
      {<IconX />}
    </span>
  )
}

export default RemoveButton
