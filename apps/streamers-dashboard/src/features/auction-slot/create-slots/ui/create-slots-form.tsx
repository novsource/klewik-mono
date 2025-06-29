import type { TransformedCreateSlotsFormData } from '../lib'
import type { CreateSlotForm } from '../model'

import type { HTMLAttributes } from 'react'
import { useCallback, useState } from 'react'

import type { Control, FieldErrors, UseFormReturn, UseFormTrigger } from 'react-hook-form'
import { useFieldArray, useFormState } from 'react-hook-form'

import * as m from 'motion/react-m'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~shared/ui/tabs'
import { cn } from '~shared/utils'

import { CREATE_SLOT_FORM_DEFAULT_VALUE } from '../constants'
import { useCreateSlotsForm } from '../hooks'
import { SlotNameFormInput, SlotPointsFormInput } from './form-fields.ui'

function getErrorMessageForField(
  errors: FieldErrors<CreateSlotForm>,
  fieldName: keyof CreateSlotForm['slots'][number],
  fieldIndex: number,
) {
  if (!('slots' in errors) || errors.slots === undefined)
    return undefined

  if (errors.slots[fieldIndex] && errors.slots[fieldIndex][fieldName]) {
    return errors.slots[fieldIndex][fieldName].message
  }
}

type CreateSlotsFormProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  maxCreatingSlotsCount?: number
  multiplySlots?: boolean
  multiplySlotsCount?: number
  onSuccess?: (formData: TransformedCreateSlotsFormData) => void
  onError?: () => void
}

const CreateSlotsForm = (props: CreateSlotsFormProps) => {
  const {
    multiplySlots = true,
    maxCreatingSlotsCount = 3,
    onSuccess,
    onError,
    ...formProps
  } = props

  const {
    form: { control, trigger, handleSubmit },
    submitForm,
    isLoading,
  } = useCreateSlotsForm({ onError, onSuccess })

  return (
    <form
      className="flex h-full w-full flex-col justify-between overflow-x-clip"
      onSubmit={handleSubmit(submitForm)}
      {...formProps}
    >
      {multiplySlots && <SlotsTabs control={control} trigger={trigger} maxCreatingSlotsCount={maxCreatingSlotsCount} />}
      <Button
        type="submit"
        variant="action"
        className="w-full"
        disabled={isLoading}
      >
        Добавить в аукцион
      </Button>
    </form>
  )
}

export { CreateSlotsForm }

export type ControlledCreateSlotsFormProps
  = HTMLAttributes<HTMLFormElement>
    & {
      form: UseFormReturn<CreateSlotForm, unknown, TransformedCreateSlotsFormData>
      maxCreatingSlotsCount?: number
      multiplySlots?: boolean
      onSuccess?: (formData: TransformedCreateSlotsFormData) => void
      onError?: () => void
    }

const ControlledCreateSlotForm = (props: ControlledCreateSlotsFormProps) => {
  const { form, maxCreatingSlotsCount, multiplySlots, onSuccess, onError, ...formProps } = props

  const { control, trigger } = form

  return (
    <form
      className="flex h-full w-full flex-col justify-between overflow-x-clip"
      {...formProps}
    >
      {multiplySlots && <SlotsTabs control={control} trigger={trigger} maxCreatingSlotsCount={maxCreatingSlotsCount} />}
    </form>
  )
}

export { ControlledCreateSlotForm }

type SlotsTabsProps = {
  control: Control<CreateSlotForm, unknown, TransformedCreateSlotsFormData>
  trigger: UseFormTrigger<CreateSlotForm>
  maxCreatingSlotsCount?: number
}

function SlotsTabs(props: SlotsTabsProps) {
  const { control, trigger, maxCreatingSlotsCount = 3 } = props

  const [tabValue, setTabValue] = useState<`slot-${number}`>('slot-0')

  const state = useFormState({ control })

  const { fields, append, remove } = useFieldArray({ control, name: 'slots' })

  const checkIsTabHasError = useCallback(
    (tabIndex: number) => {
      if (!state.errors.slots)
        return false

      return !!state.errors.slots[tabIndex]
    },
    [state.errors],
  )

  const tabSlotNumber = Number(tabValue.split('-')[1])

  if (fields.length - 1 < tabSlotNumber) {
    setTabValue(`slot-${fields.length - 1}`)
  }

  const renderFormFields = useCallback(
    (field: (typeof fields)[number], index: number) => {
      return (
        <m.li key={field.id} className="relative flex w-full flex-col gap-y-4">
          <SlotNameFormInput
            control={control}
            name={`slots.${index}.title` as const}
            errorMessage={getErrorMessageForField(state.errors, 'title', index)}
          />
          <SlotPointsFormInput
            control={control}
            name={`slots.${index}.points` as const}
            errorMessage={getErrorMessageForField(
              state.errors,
              'points',
              index,
            )}
          />
          {fields.length > 1 && (
            <Button
              variant="error"
              startContent={<Icons.Bin className="text-red" size="sm" />}
              onClick={() => {
                if (fields.length > 1) {
                  remove(index)
                }
              }}
            >
              Удалить слот
            </Button>
          )}
        </m.li>
      )
    },
    [fields, state.errors, control, remove],
  )

  return (
    <Tabs
      className="space-y-6 px-0.25"
      defaultValue="slot-0"
      value={tabValue}
      onValueChange={value => setTabValue(value as `slot-${number}`)}
    >
      <Flex align="center">
        <TabsList className="flex w-fit justify-between rounded-large bg-dark">
          {fields.map((field, index) => (
            <TabsTrigger
              className={cn(
                'flex cursor-pointer gap-x-1 text-md font-medium text-gray-light/70 hover:text-gray-light data-[state=active]:rounded-[8px] data-[state=active]:[&_button]:block',
                checkIsTabHasError(index)
                && 'text-red/80 hover:text-red data-[state=active]:text-red',
              )}
              key={field.id}
              value={`slot-${index}`}
            >
              Слот
              {' '}
              {index + 1}
            </TabsTrigger>
          ))}
          {fields.length < maxCreatingSlotsCount && (
            <Button
              variant="ghost"
              className="transition-colors text-gray-light hover:text-gray-accent"
              startContent={<Icons.Plus />}
              size="sm"
              onClick={() => {
                append(CREATE_SLOT_FORM_DEFAULT_VALUE)
                trigger('slots')
              }}
            />
          )}
        </TabsList>
      </Flex>

      {fields.map((field, index) => {
        return (
          <TabsContent value={`slot-${index}`} key={field.id}>
            {renderFormFields(field, index)}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
