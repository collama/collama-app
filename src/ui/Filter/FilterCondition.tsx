import React, { type PropsWithChildren } from "react"
import {
  type Control,
  Controller,
  type FieldError,
  type FormState,
} from "react-hook-form"
import { Select } from "~/ui/Select"
import { Input } from "~/ui/Input"
import {
  BOOLEAN_CONDITION,
  DATE_CONDITION,
  FILTER_FORM_NAME,
  STRING_CONDITION,
} from "~/ui/Filter/constants"
import { type FilterSchema } from "~/ui/Filter/FilterForm"

export const HandleFormError = ({
  condition,
  children,
}: { condition?: FieldError } & PropsWithChildren) => {
  return (
    <div>
      {children}
      {condition && <span className="text-red-600">{condition.message}</span>}
    </div>
  )
}

export type FilterConditionProps = {
  index: number
  formState: FormState<FilterSchema>
  control: Control<FilterSchema>
}

export const FilterCondition = ({
  index,
  formState,
  control,
}: FilterConditionProps) => {
  return (
    <HandleFormError condition={formState.errors?.filter?.[index]?.columns}>
      <Controller
        control={control}
        name={`${FILTER_FORM_NAME}.${index}.condition`}
        render={({ field }) => {
          return (
            <Select
              {...field}
              width={150}
              options={BOOLEAN_CONDITION}
              defaultValue={{ value: field.value }}
            />
          )
        }}
      />
    </HandleFormError>
  )
}

export const StringCondition = ({
  index,
  formState,
  control,
}: FilterConditionProps) => {
  return (
    <>
      <HandleFormError condition={formState.errors?.filter?.[index]?.condition}>
        <Controller
          control={control}
          name={`${FILTER_FORM_NAME}.${index}.condition`}
          render={({ field }) => {
            return (
              <Select
                {...field}
                width={150}
                options={STRING_CONDITION}
                defaultValue={{ value: field.value }}
              />
            )
          }}
        />
      </HandleFormError>
      <HandleFormError condition={formState.errors?.filter?.[index]?.condition}>
        <Controller
          control={control}
          name={`${FILTER_FORM_NAME}.${index}.value`}
          render={({ field }) => {
            return (
              <Input
                {...field}
                className="w-[140px] rounded border"
                placeholder="enter value ..."
                size="sm"
                defaultValue={field.value}
              />
            )
          }}
        />
      </HandleFormError>
    </>
  )
}

export const DateCondition = ({
  index,
  formState,
  control,
}: FilterConditionProps) => {
  return (
    <>
      <HandleFormError condition={formState.errors?.filter?.[index]?.condition}>
        <Controller
          control={control}
          name={`${FILTER_FORM_NAME}.${index}.condition`}
          render={({ field }) => {
            return <Select {...field} width={150} options={DATE_CONDITION} />
          }}
        />
      </HandleFormError>
      <HandleFormError condition={formState.errors?.filter?.[index]?.condition}>
        <Controller
          control={control}
          name={`${FILTER_FORM_NAME}.${index}.value`}
          render={({ field }) => {
            return (
              <Input
                {...field}
                className="w-[140px] rounded border outline-1"
                placeholder="enter value ..."
                size="sm"
                defaultValue={field.value}
              />
            )
          }}
        />
      </HandleFormError>
    </>
  )
}
