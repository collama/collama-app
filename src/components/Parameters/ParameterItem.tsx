import { type ChangeEvent, type FC, useCallback, useState } from "react"
import { cl } from "~/common/utils"
import { Button } from "~/ui/Button"
import { MultipleTag } from "~/ui/MultipleTag"
import { Popover } from "~/ui/Popover"
import { Slider } from "~/ui/Slider"
import { Tag } from "~/ui/Tag"

type ParameterItemProps = {
  id: string
  onChange?: (value: number, id: string) => void
} & Omit<ContentProps, "onChange">

export const ParameterItem: FC<ParameterItemProps> = ({
  id,
  onChange,
  ...contentProps
}) => {
  const [value, setValue] = useState(contentProps.defaultValue)

  const handleChange = useCallback(
    (value: number) => {
      setValue(value)
      onChange?.(value, id)
    },
    [id]
  )

  return (
    <Popover content={<Content {...contentProps} onChange={handleChange} />}>
      <div className="aria-expanded:ring ring-violet-200 inline-flex select-none items-center overflow-hidden border rounded-lg border-gray-300 hover:border-gray-400">
        <span className="text-sm px-1.5 bg-zinc-100 ">{contentProps.name}</span>
        <span className="text-sm px-1.5 text-neutral-700 font-bold">
          {value}
        </span>
      </div>
    </Popover>
  )
}

interface ContentProps {
  name: string
  content: string
  description: string
  min: number
  max: number
  step: number
  defaultValue: number
  onChange?: (value: number) => void
  moreDetail?: string
}

export const Content: FC<ContentProps> = ({
  name,
  content,
  moreDetail,
  description,
  min,
  max,
  defaultValue,
  step,
  onChange,
}) => {
  const [value, setValue] = useState<number[]>([defaultValue])

  const handleChange = (value: number[]) => {
    setValue(value)

    if (!isNaN(value[0]!)) {
      onChange?.(value[0]!)
    }
  }

  const onReset = () => {
    handleChange([0])
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value)

    handleChange([value])
  }

  return (
    <div className="p-4 max-w-[200px] space-y-4">
      <div className="flex w-full justify-between items-center">
        <input
          onChange={onInputChange}
          type="number"
          min={min}
          max={max}
          value={`${value[0]!}`}
          className="w-16 px-2 text-neutral-700 text-right text-sm no-spinner outline-0 border rounded-lg border-transparent hover:border-neutral-300 focus:border-violet-400"
        />
        <Button size="sm" onClick={onReset}>
          <span className="text-neutral-700">Reset</span> {defaultValue}
        </Button>
      </div>

      <Slider
        min={min}
        max={max}
        value={value}
        step={step}
        onValueChange={(value) => handleChange(value)}
      />

      <div className="space-y-4 text-sm">
        <header className="font-bold text-neutral-800">{name}</header>
        <div>
          <strong>{content} </strong>
          <span>{description} </span>
          <span className="text-gray-400 italic">{moreDetail}</span>
        </div>
      </div>
    </div>
  )
}

type StopItemProps = {
  id: string
  onChange: (values: string[], id: string) => void
} & Omit<StopContentProps, "onChange">

export const StopItem: FC<StopItemProps> = ({ id, onChange, ...props }) => {
  const [values, setValues] = useState<string[]>([])

  const handleChange = useCallback(
    (values: string[]) => {
      setValues(values)
      onChange(values, id)
    },
    [id]
  )

  return (
    <Popover content={<StopContent {...props} onChange={handleChange} />}>
      <div
        className={cl(
          "aria-expanded:ring ring-violet-200 inline-flex select-none items-center overflow-hidden border rounded-lg border-gray-300 hover:border-gray-400",
          { "gap-x-2 pe-1": values.length > 0 }
        )}
      >
        <span className="text-sm  px-1.5 bg-zinc-100 ">{props.name}</span>
        {values.length > 0 ? (
          values.map((value) => (
            <Tag
              classname="my-0.5 text-neutral-700 font-bold"
              closeIcon={false}
              key={value}
            >
              {value}
            </Tag>
          ))
        ) : (
          <span className="text-sm px-1.5 text-neutral-700 font-bold">
            None
          </span>
        )}
      </div>
    </Popover>
  )
}

type StopContentProps = {
  limit: number
  onChange: (values: string[]) => void
} & Pick<ContentProps, "name" | "content" | "description" | "moreDetail">

const StopContent = ({
  name,
  content,
  moreDetail,
  description,
  onChange,
  limit,
}: StopContentProps) => {
  return (
    <div className="p-4 w-[200px] space-y-4">
      <div className="flex w-full justify-between items-center">
        <MultipleTag limit={limit} onChange={onChange} />
      </div>

      <div className="space-y-4">
        <header className="font-bold text-neutral-800">{name}</header>
        <div>
          <strong>{content} </strong>
          <span>{description} </span>
          <span className="text-gray-400 italic">{moreDetail}</span>
        </div>
      </div>
    </div>
  )
}
