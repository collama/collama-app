import React, { forwardRef, useState } from "react"
import { Input, type InputProps } from "~/ui/Input/Input"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import type { InputRef } from "~/ui/Col-ui/Input"

export type PasswordInputProps = {} & InputProps

export const Password = forwardRef<InputRef, PasswordInputProps>(
  function Password(props, ref) {
    const [visible, setVisible] = useState(false)

    const getIcon = () => {
      if (visible) {
        return <IconEye onClick={() => setVisible(false)} />
      }
      return <IconEyeOff onClick={() => setVisible(true)} />
    }

    return (
      <Input
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        suffix={getIcon()}
      />
    )
  }
)
