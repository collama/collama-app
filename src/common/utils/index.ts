import {z} from "zod";

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const noop = () => undefined

export const isEmail = (text: string): boolean => {
  const res = z.string().email().catch('false').parse(text)
  return res !== 'false'
}
