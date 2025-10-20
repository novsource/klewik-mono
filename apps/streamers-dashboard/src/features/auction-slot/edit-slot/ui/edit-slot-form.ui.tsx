import type { TransformedEditSlotFormData } from '../lib'
import type { EditSlotFormData } from '../model'

import type { ComponentProps, HTMLAttributes } from 'react'

import type {
  Control,
  DefaultValues,
  UseFormReturn,
} from 'react-hook-form'
import {
  useController,
  useFormState,
} from 'react-hook-form'

import { SlotPointsFormInput } from '~features/auction-slot/create-slots/ui/form-fields.ui'

import type { AuctionSlot } from '~entities/auction-slot/model'

import type { AxiosBaseQueryError } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Input } from '~shared/ui/input'

import { cn } from '~shared/utils'

import { useEditSlotForm } from '../hooks'

type ControlledEditSlotFormProps = ComponentProps<'form'> & {
  form: UseFormReturn<
    EditSlotFormData,
    unknown,
    TransformedEditSlotFormData
  >
}

export const ControlledEditSlotForm = (props: ControlledEditSlotFormProps) => {
  const { form, className, ...formProps } = props

  return (
    <form
      className={cn('flex h-full w-full flex-col justify-between', className)}
      {...formProps}
    >
      <Flex className="w-full gap-y-6" direction="column" align="stretch">
        <Flex className="w-full" component="ul" direction="column">
          <Flex
            className="h-full w-full gap-y-3 overflow-y-scroll p-1"
            direction="column"
          >
            <EditSlotFormFields control={form.control} />
          </Flex>
        </Flex>
      </Flex>
    </form>
  )
}

type EditSlotsFormStateProps = {
  defaultValues?: DefaultValues<EditSlotFormData>
}

type EditSlotsFormProps = Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  slot: AuctionSlot
  formMethods: UseFormReturn<
    EditSlotFormData,
    unknown,
    TransformedEditSlotFormData
  >
  onSuccess?: (formData: TransformedEditSlotFormData) => void
  onError?: (error: AxiosBaseQueryError) => void
} & EditSlotsFormStateProps

export const EditSlotForm = (props: EditSlotsFormProps) => {
  const { slot, onError, onSuccess, defaultValues, className, ...formProps } = props

  const {
    submitForm,
    form,
    formState,
    isLoading,
  } = useEditSlotForm(slot, { onSuccess, onError })

  const isFieldsChanges = formState.isDirty

  return (
    <form
      className={cn('flex h-full w-full flex-col justify-between', className)}
      onSubmit={form.handleSubmit(submitForm)}
      {...formProps}
    >
      <Flex className="w-full gap-y-6" direction="column" align="stretch">
        <Flex className="w-full" component="ul" direction="column">
          <Flex
            className="h-full w-full gap-y-3 overflow-y-scroll p-1"
            direction="column"
          >
            <EditSlotFormFields control={form.control} />
          </Flex>
        </Flex>
      </Flex>
      <Button
        type="submit"
        variant="action"
        className="w-full"
        disabled={isLoading || !isFieldsChanges}
      >
        Изменить слот
      </Button>
    </form>
  )
}

type EditSlotFormFieldsProps = {
  control: Control<EditSlotFormData, unknown, TransformedEditSlotFormData>
}

function EditSlotFormFields({ control }: EditSlotFormFieldsProps) {
  const formState = useFormState({ control })

  const { field: slotNameField } = useController({ control, name: 'title' })

  const getErrorMessageForField = (
    fieldName: keyof EditSlotFormData,
  ): string | undefined => {
    if (formState.errors[fieldName]) {
      return formState.errors[fieldName].message
    }
  }

  return (
    <Flex className="gap-y-4">
      <Input
        slotClassNames={{
          base: 'font-golos-f w-full basis-1/2 grow',
          description: 'text-wrap',
        }}
        label={{ id: 'slotTitle', value: 'Новое название' }}
        placeholder="Название слота"
        errorMessage={getErrorMessageForField('title')}
        {...slotNameField}
      />
      <SlotPointsFormInput control={control} name="points" />
    </Flex>
  )
}
