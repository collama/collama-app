import cx from "classnames"
import { twMerge } from "tailwind-merge"
import { z } from "zod"

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const noop = () => undefined

export const isEmail = (text: string): boolean => {
  const res = z.string().email().catch("false").parse(text)
  return res !== "false"
}

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1)

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

export const cl = (...className: cx.ArgumentArray): string => twMerge(cx(className))
