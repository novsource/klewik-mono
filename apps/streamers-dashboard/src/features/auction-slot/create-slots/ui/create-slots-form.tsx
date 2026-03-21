import type { CreateSlotForm, TransformedCreateSlotsFormData } from '../model'

import type { ComponentProps } from 'react'
import { useCallback, useMemo, useState } from 'react'

import type { Control, FieldErrors, UseFormReturn, UseFormTrigger } from 'react-hook-form'
import { useFieldArray, useFormState } from 'react-hook-form'

import * as m from 'motion/react-m'

import type { AuctionSlotDTO } from '~shared/api/sse/clients/auction-slots'

import { Button } from 'klewik-ui/button'
import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'klewik-ui/tabs'

import { cn, twSlotsStyles } from '~shared/utils'
import { chain } from '~shared/utils/common'

import { CREATE_SLOT_FORM_DEFAULT_VALUE } from '../constants'
import { useCreateSlotsForm } from '../hooks'
import { createSlotsFormStyles } from '../styles'
import { CreateSlotsFormComposer } from './create-slots-form-composer.ui'

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
  ComponentProps<'form'>,
  'onSubmit'
> & {
  maxCreatingSlotsCount?: number
  multiplySlots?: boolean
  multiplySlotsCount?: number
  onSuccess?: (formData: AuctionSlotDTO[]) => void
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
    form,
    state,
    submitForm,
    isLoading,
  } = useCreateSlotsForm({ onError, onSuccess })

  const { control, trigger, handleSubmit } = form

  const styles = useMemo(() => twSlotsStyles(createSlotsFormStyles), [])

  return (
    <CreateSlotsFormComposer
      form={form}
      className={styles.form}
      onSubmit={handleSubmit(submitForm)}
      {...formProps}
    >
      {multiplySlots
        && (
          <SlotsTabs
            control={control}
            trigger={trigger}
            maxCreatingSlotsCount={maxCreatingSlotsCount}
          />
        )}
      {!multiplySlots
        && (
          <div className={styles.formInputsWrapper}>
            <CreateSlotsFormComposer.SlotTitleInput
              name="slots.0.title"
              errorMessage={getErrorMessageForField(state.errors, 'title', 0)}
              onChange={() => {
                trigger()
              }}
            />
            <CreateSlotsFormComposer.SlotPointsInput
              name="slots.0.points"
              pointsInputProps={{
                errorMessage: getErrorMessageForField(
                  state.errors,
                  'points',
                  0,
                ),
                onChange: () => {
                  trigger()
                },
              }}
              percentInputProps={{
                onChange: () => {
                  trigger()
                },
              }}
            />
          </div>
        )}
      <Button
        type="submit"
        className={styles.submitButton}
        variant="action"
        disabled={isLoading}
      >
        Добавить в аукцион
      </Button>
    </CreateSlotsFormComposer>
  )
}

export { CreateSlotsForm }

export type ControlledCreateSlotsFormProps
  = ComponentProps<'form'>
    & {
      form: UseFormReturn<CreateSlotForm, unknown, TransformedCreateSlotsFormData>
      maxCreatingSlotsCount?: number
      multiplySlots?: boolean
      onSuccess?: (formData: TransformedCreateSlotsFormData) => void
      onError?: () => void
    }

const ControlledCreateSlotForm = (props: ControlledCreateSlotsFormProps) => {
  const { form, maxCreatingSlotsCount, multiplySlots, onSubmit, onSuccess, onError, ...formProps } = props

  const { control, trigger } = form

  const state = useFormState({ control })

  const styles = useMemo(() => twSlotsStyles(createSlotsFormStyles), [])

  return (
    <CreateSlotsFormComposer
      form={form}
      className={styles.form}
      onSubmit={onSubmit ? chain(event => event.preventDefault(), onSubmit) : event => event.preventDefault()}
      {...formProps}
    >
      {multiplySlots
        && (
          <SlotsTabs
            control={control}
            trigger={trigger}
            maxCreatingSlotsCount={maxCreatingSlotsCount}
          />
        )}
      {!multiplySlots
        && (
          <div className={styles.formInputsWrapper}>
            <CreateSlotsFormComposer.SlotTitleInput
              name="slots.0.title"
              errorMessage={getErrorMessageForField(state.errors, 'title', 0)}
              onChange={() => {
                trigger()
              }}
            />
            <CreateSlotsFormComposer.SlotPointsInput
              control={control}
              name="slots.0.points"
              pointsInputProps={{
                errorMessage: getErrorMessageForField(
                  state.errors,
                  'points',
                  0,
                ),
                onChange: () => {
                  trigger()
                },
              }}
              percentInputProps={{
                onChange: () => {
                  trigger()
                },
              }}
            />
          </div>
        )}
    </CreateSlotsFormComposer>
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

  const styles = useMemo(() => twSlotsStyles(createSlotsFormStyles), [])

  const renderFormFields = useCallback(
    (field: (typeof fields)[number], index: number) => {
      return (
        <m.li key={field.id} className={styles.formInputsWrapper}>
          <CreateSlotsFormComposer.SlotTitleInput
            name={`slots.${index}.title` as const}
            errorMessage={getErrorMessageForField(state.errors, 'title', index)}
            onChange={() => {
              trigger('slots')
            }}
          />
          <CreateSlotsFormComposer.SlotPointsInput
            name={`slots.${index}.points` as const}
            pointsInputProps={{
              errorMessage: getErrorMessageForField(
                state.errors,
                'points',
                index,
              ),
              onBlur: () => {
                trigger('slots')
              },
              onChange: () => {
                trigger('slots')
              },
            }}
            percentInputProps={{
              onChange: () => {
                trigger('slots')
              },
              onBlur: () => {
                trigger('slots')
              },
            }}
          />
          {fields.length > 1 && (
            <Button
              variant="error"
              size="sm"
              startContent={<Icons.Bin className="text-red" size="xs" />}
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
    /* eslint-disable react-hooks/exhaustive-deps */
    [fields, state.errors, trigger, control, remove],
  )

  return (
    <Tabs
      className={styles.tabs}
      defaultValue="slot-0"
      value={tabValue}
      onValueChange={value => setTabValue(value as `slot-${number}`)}
    >
      <Flex align="center">
        <TabsList className={styles.tabsList}>
          {fields.map((field, index) => (
            <TabsTrigger
              key={field.id}
              className={cn(styles.tabTrigger, checkIsTabHasError(index) && styles.isErrorTabTrigger)}
              value={`slot-${index}`}
              tabIndex={-1}
            >
              {`Слот ${index + 1}`}
            </TabsTrigger>
          ))}
          {fields.length < maxCreatingSlotsCount && (
            <Button
              className={styles.addNewTabButton}
              variant="ghost"
              size="xs"
              isIconOnly
              icon={<Icons.Plus />}
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
