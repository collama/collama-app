export const defaultGetContainer = () => document.body

export function mergeConfig<T>(...objList: Partial<T>[]): T {
  const clone: T = {} as T

  objList.forEach((obj) => {
    if (obj) {
      Object.keys(obj).forEach((key) => {
        const value = obj[key as keyof T]

        if (value !== undefined) {
          clone[key as keyof T] = value
        }
      })
    }
  })

  return clone
}
