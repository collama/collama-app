interface AvatarProps {
  character: string
  color: string
}

export default function Avatar({ character, color }: AvatarProps) {
  return (
    <div
      className={`h-[32px] w-[32px] flex items-center justify-center rounded-lg bg-green-100 text-green-500 text-xs`}
    >
      {character}
    </div>
  )
}
