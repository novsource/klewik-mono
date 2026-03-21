import type { TransformedEditSlotFormData } from '../lib'
import type { EditSlotFormData } from '../model'

import type { ComponentPropsWithoutRef } from 'react'

import type { UseFormReturn } from 'react-hook-form'
import { FormProvider, useFormContext } from 'react-hook-form'

import { SlotPointsFormInput, SlotTitleFormInput } from '~entities/auction-slot/ui/form'

import { getErrorMessageForField } from '~shared/lib/react-hook-form'

import type { ButtonProps } from 'klewik-ui/button'
import { Button } from 'klewik-ui/button'
import { Icons } from 'klewik-ui/icons'
import type { InputProps } from 'klewik-ui/input'

export type EditSlotFormComposerProps = ComponentPropsWithoutRef<'form'> & {
  form: UseFormReturn<EditSlotFormData, unknown, TransformedEditSlotFormData>
}

export const EditSlotFormComposer = (props: EditSlotFormComposerProps) => {
  const { form, ...restProps } = props

  return (
    <FormProvider {...form}>
      <form {...restProps} />
    </FormProvider>
  )
}

EditSlotFormComposer.TitleFieldInput = EditSlotFormTitleFieldInput
EditSlotFormComposer.PointsFieldInput = EditSlotFormPointsFieldInput
EditSlotFormComposer.SubmitButton = EditSlotFormSubmitButton

function EditSlotFormTitleFieldInput(props: Omit<InputProps, 'name' | 'value' | 'defaultValue'>) {
  const { control, formState, trigger } = useFormContext<EditSlotFormData>()

  return (
    <SlotTitleFormInput
      control={control}
      name="title"
      slotClassNames={{
        base: 'font-golos-f w-full basis-1/2 grow',
        description: 'text-wrap',
      }}
      errorMessage={getErrorMessageForField(formState, 'title')}
      onChange={() => trigger()}
      {...props}
    />
  )
}

function EditSlotFormPointsFieldInput(props: Omit<InputProps, 'type' | 'name' | 'value' | 'defaultValue'>) {
  const { control, formState, trigger } = useFormContext<EditSlotFormData>()

  return (
    <SlotPointsFormInput
      control={control}
      name="points"
      showPercentInput={false}
      pointsInputProps={{
        errorMessage: getErrorMessageForField(formState, 'points'),
        variant: 'ghost',
        label: undefined,
        startContent: undefined,
        slotClassNames: { input: 'text-right text-white/80' },
        onChange: () => trigger(),
        isAllowed: value =>
          value?.floatValue ? value.floatValue <= 1_000_000 : true,
        ...props,
      }}
    />
  )
}

function EditSlotFormSubmitButton(props: ButtonProps) {
  const { formState } = useFormContext<EditSlotFormData>()

  const isDisabled = !formState.isDirty || formState.isLoading || !formState.isValid

  return (
    <Button
      type="submit"
      variant="action"
      disabled={isDisabled}
      startContent={<Icons.Save width={14} height={14} />}
      {...props}
    >
      Сохранить
    </Button>
  )
}
