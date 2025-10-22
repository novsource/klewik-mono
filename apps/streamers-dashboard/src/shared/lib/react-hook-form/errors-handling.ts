import type { FieldValues, UseFormStateReturn } from 'react-hook-form'

export const getErrorMessageForField = <TFieldValues extends FieldValues, FormState extends UseFormStateReturn<TFieldValues>>
(formState: FormState,
  field: keyof Omit<FormState['errors'], 'root'>,
) => {
  if (formState.errors[field])
    return formState.errors[field].message?.toString()

  return ''
}
