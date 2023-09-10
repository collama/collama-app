import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  useEffect,
  useState,
} from "react"
import { KEY } from "~/common/constants/key"
import { Select, type SelectOption } from "~/ui/Select"
import { util } from "zod"
import { Input } from "~/ui/Input"
import { Button } from "~/ui/Button"

const defaultPageOptions: SelectOption[] = [
  { value: "10", label: "10 / page" },
  { value: "20", label: "20 / page" },
  { value: "50", label: "50 / page" },
]

export type PageSize = 10 | 20 | 50

type PaginationProps = {
  total: number
  pageSize?: PageSize
  defaultPage?: number
  onChange?: (newPage: number, pageSize: PageSize) => void
}

const transformTotalPage = (total: number, size: number) =>
  Math.ceil(total / size)

export const Pagination: FC<PaginationProps> = ({
  onChange,
  total = 1,
  pageSize = 20,
  defaultPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(defaultPage)
  const [inputValue, setInputValue] = useState<number | undefined>(currentPage)
  const [size, setSize] = useState<PageSize>(pageSize)

  useEffect(() => {
    onChange?.(currentPage, pageSize)
  }, [])

  const totalPage = transformTotalPage(total, size)
  const hasNext = () => currentPage < totalPage
  const hasPrev = () => currentPage > 1

  const next = () => {
    if (hasNext()) {
      change(currentPage + 1)
    }
  }
  const prev = () => {
    if (hasPrev()) {
      change(currentPage - 1)
    }
  }

  const getValidValue = (
    e: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ): number | undefined => {
    const target = e.target as HTMLInputElement
    const inputValue = target.value

    let value: number | undefined

    if (inputValue === "") {
      value = undefined
    } else if (Number.isNaN(parseInt(inputValue))) {
      value = currentPage
    } else if (parseInt(inputValue) >= totalPage) {
      value = totalPage
    } else {
      value = parseInt(inputValue)
    }

    return value
  }

  const isValid = (page: number) =>
    util.isInteger(page) && page > 0 && page <= totalPage

  const change = (page: number) => {
    if (isValid(page)) {
      const newPage = inputValue ? page : 1

      if (newPage !== currentPage) {
        setCurrentPage(newPage)
      }
      setInputValue(newPage)
      onChange?.(newPage, size)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = getValidValue(e)

    setInputValue(value)

    inputValue && value && change(value)
  }

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEY.Enter) {
      change(currentPage)
      const target = e.target as HTMLInputElement
      target.blur()
    }

    if (e.key === KEY.ArrowUp) {
      next()
    }

    if (e.key === KEY.ArrowDown) {
      prev()
    }
  }

  const changPageSize = (size: string) => {
    const pageSize = parseInt(size) as PageSize
    setSize(pageSize)
    onChange?.(currentPage, pageSize)
  }

  return (
    <ul className="space-x-2">
      <li className="inline-block">
        <Button disable={!hasPrev()} onClick={prev}>
          Prev
        </Button>
      </li>
      <li className="inline-block">
        <Button disable={!hasNext()} onClick={next}>
          Next
        </Button>
      </li>
      <li className="inline-block space-x-1.5">
        <Input
          value={inputValue ?? ""}
          onKeyUp={handleKeyUp}
          onChange={handleChange}
          onBlur={() => change(currentPage)}
          type="text"
          size="sm"
          className="!w-14 px-2"
        />
        <span>/</span>
        {totalPage}
      </li>
      <li className="inline-block">
        <Select
          options={defaultPageOptions}
          defaultValue={{ value: pageSize.toString() }}
          onChange={changPageSize}
          width={100}
        />
      </li>
    </ul>
  )
}
