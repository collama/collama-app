"use client"

import { IconX } from "@tabler/icons-react"
import { type FC, type KeyboardEvent, useRef, useState } from "react"
import { Input, type InputRef } from "~/ui/Input"
import { Tag } from "~/ui/Tag"
import { Key } from "~/ui/common/key"

interface MultipleTagProps {
  limit?: number
  onChange?: (tags: string[]) => void
}

export const MultipleTag: FC<MultipleTagProps> = ({ onChange, limit = 10 }) => {
  const [tags, setTags] = useState<string[]>([])
  const inputRef = useRef<InputRef | null>(null)
  const [inputValue, setInputValue] = useState("")

  const handleAddTag = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === Key.Enter) {
      setInputValue(`${inputValue} ⏎`)
    }

    if (event.key === Key.Tab) {
      event.preventDefault()

      if (tags.length >= limit) return

      if (tags.includes(inputValue)) return

      const newState = [...tags, inputValue]

      setTags(newState)
      onChange?.(newState)
      setInputValue("")
    }
  }

  const removeTag = (index?: number) => {
    if (!index) {
      setTags([])
      onChange?.([])
      return
    }

    const newState = tags.filter((_, i) => i !== index)

    setTags(newState)
    onChange?.(newState)
  }

  return (
    <div className="flex justify-between items-center flex-grow-0 p-1 w-full border rounded-lg">
      <div className="inline-flex w-full flex-wrap gap-1">
        {tags.map((tag, index) => (
          <Tag onClose={() => removeTag(index)} key={tag}>
            {tag}
          </Tag>
        ))}
        <Input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          className="text-neutral-800 border-0 inline-flex flex-1 w-8 shrink grow bg-white pb-[3px] pl-1 pt-1 text-sm focus:h-[inherit] focus:outline-none "
          ref={inputRef}
          onKeyDown={handleAddTag}
        />
      </div>
      {tags.length > 0 && (
        <div>
          <IconX
            onClick={() => removeTag()}
            className="p-1 rounded hover:bg-neutral-100 active:bg-neutral-200 cursor-pointer"
          />
        </div>
      )}
    </div>
  )
}
