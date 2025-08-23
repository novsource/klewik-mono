import type { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form'
import { useController } from 'react-hook-form'

import { mergeProps } from '@base-ui-components/react'

import { DONATION_STATUS_NAME } from '~shared/constants/donations'

import { Icons } from '~shared/ui/icons'
import type { InputProps } from '~shared/ui/input'
import { Input } from '~shared/ui/input'
import type { SelectProps } from '~shared/ui/select'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~shared/ui/select'

export type ProcessDonationStatusFieldProps<
  FormFields extends FieldValues | Record<string, FieldValues>,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
> = SelectProps & {
  formControllerProps: UseControllerProps<FormFields, Paths, TransformedValues>
}

export const ProcessDonationStatusField = <
  FormFields extends FieldValues,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
>(props: ProcessDonationStatusFieldProps<FormFields, Paths, TransformedValues>) => {
  const { formControllerProps, ...selectProps } = props

  const { field: { value, onChange } } = useController(formControllerProps)

  return (
    <Select
      value={value}
      onValueChange={status => onChange(status)}
      {...selectProps}
    >
      <SelectTrigger className="min-w-[80px]">
        <Icons.Status />
        <SelectValue placeholder="Статус" />
      </SelectTrigger>

      <SelectContent sideOffset={4}>
        <SelectGroup>
          {(
            Object.keys(DONATION_STATUS_NAME) as Array<
              keyof typeof DONATION_STATUS_NAME
            >
          ).map(status => (
            <SelectItem key={status} value={status}>
              {DONATION_STATUS_NAME[status]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export type ProcessDonationTitleFieldProps<
  FormFields extends FieldValues | Record<string, FieldValues>,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
> = InputProps & {
  formControllerProps: UseControllerProps<FormFields, Paths, TransformedValues>
}

export const ProcessDonationTitleField = <
  FormFields extends FieldValues,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
>(props: ProcessDonationTitleFieldProps<FormFields, Paths, TransformedValues>) => {
  const {
    formControllerProps,
    ref,
    ...restProps
  } = props

  const { field } = useController(formControllerProps)

  const inputProps = mergeProps<typeof Input>(restProps, field)

  return (
    <Input
      ref={ref}
      placeholder="Введите название"
      {...inputProps}
    />
  )
}
