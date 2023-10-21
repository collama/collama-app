import { nanoid } from "nanoid"
import slugify from "slugify"

export const slugMaxSize = 26

export const createSlug = (text: string): string => {
  return slugify(text, {
    replacement: "-", // replace spaces with replacement character, defaults to `-`
    lower: true, // convert to lower case, defaults to `false`
    strict: true, // strip special characters except replacement, defaults to `false`
    locale: "en", // language code of the locale to use
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  })
}

const convertSlugSize = (slug: string) => {
  return slug.length <= slugMaxSize ? slug : slug.slice(0, slugMaxSize)
}

export const generateSlug = (text?: string) => {
  const random = nanoid()
  const slug = text ? `${text}-${random}` : random

  return createSlug(convertSlugSize(slug))
}
