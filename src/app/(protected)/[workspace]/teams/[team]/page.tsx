import { PageProps } from "~/common/types/props"

interface Props {
  team: string
}

export default function TeamByNamePage({ params }: PageProps<Props>) {
  return <div>Hello {params.team}</div>
}
