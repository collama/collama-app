import type z from "zod"
import { useForm, type UseFormProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export default function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema
  }
) {
  return useForm<TSchema["_input"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  })
}
