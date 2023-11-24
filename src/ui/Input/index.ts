import type { InputProps } from "./Input"
import { Input as InternalInput } from "./Input"
import type * as React from "react"
import type { InputRef } from "~/ui/Col-ui/Input"
import { Password } from "~/ui/Input/Password"
import { TextArea } from "~/ui/Input/TextArea"

export type { InputProps } from "./Input"

type CompoundedComponent = React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<InputRef>
> & {
  Password: typeof Password
  TextArea: typeof TextArea
}

const Input = InternalInput as CompoundedComponent

if (process.env.NODE_ENV !== "production") {
  Input.displayName = "Input"
}

Input.Password = Password
Input.TextArea = TextArea
export { Input, InputRef }
