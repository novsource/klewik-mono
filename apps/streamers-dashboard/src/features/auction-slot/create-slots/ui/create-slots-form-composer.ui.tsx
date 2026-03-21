import type { CreateSlotForm, TransformedCreateSlotsFormData } from '../model'

import type { ComponentPropsWithoutRef } from 'react'

import type { UseFormReturn } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'

import { SlotPointsFormInput, SlotTitleFormInput } from '~entities/auction-slot/ui/form'

export type CreateSlotsFormComposerProps = ComponentPropsWithoutRef<'form'> & {
  form: UseFormReturn<CreateSlotForm, unknown, TransformedCreateSlotsFormData>
}

export const CreateSlotsFormComposer = (props: CreateSlotsFormComposerProps) => {
  const { form, ...restProps } = props

  return (
    <FormProvider {...form}>
      <form {...restProps} />
    </FormProvider>
  )
}

CreateSlotsFormComposer.SlotTitleInput = SlotTitleFormInput
CreateSlotsFormComposer.SlotPointsInput = SlotPointsFormInput
