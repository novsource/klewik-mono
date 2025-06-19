import { HTMLAttributes, useCallback, useState } from 'react'
import {
  FieldErrors,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from 'react-hook-form'

import * as m from 'motion/react-m'

import { auctionSelectors } from '~entities/auction/store'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import {
  AxiosBaseQueryError,
  useStoreSelector,
} from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~shared/ui/tabs'
import {
  toastErrorNotification,
  toastSuccessNotification,
} from '~shared/ui/toaster/lib'

import { cn } from '~shared/utils'

import { useCreateSlotsMutation } from '../api'
import { TransformedCreateSlotsFormData, createSlotsFormResolver } from '../lib'
import { CreateSlotForm, FormArrayData } from '../model'
import { SlotNameFormInput, SlotPointsFormInput } from './form-fields.ui'

const getErrorMessageForField = (
  errors: FieldErrors<CreateSlotForm>,
  fieldName: keyof CreateSlotForm['slots'][number],
  fieldIndex: number
): string | undefined => {
  if (!('slots' in errors) || errors.slots === undefined) return undefined

  if (errors['slots'][fieldIndex] && errors['slots'][fieldIndex][fieldName]) {
    return errors['slots'][fieldIndex][fieldName].message
  }
}

const DEFAULT_FORM_VALUE: CreateSlotForm['slots'][number] = {
  name: '',
  points: '1000',
}

type CreateSlotsFormProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  multiplySlots?: boolean
  multiplySlotsCount?: number
  checkIsSlotsExists?: boolean
  onSuccess?: (formData: FormArrayData[]) => void
  onError?: () => void
}

export const CreateSlotsForm = ({
  multiplySlots,
  ...props
}: CreateSlotsFormProps) => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const formMethods = useForm<
    CreateSlotForm,
    unknown,
    TransformedCreateSlotsFormData
  >({
    defaultValues: { slots: [DEFAULT_FORM_VALUE] },
    resolver: createSlotsFormResolver(auctionSlots),
    reValidateMode: 'onChange',
    shouldFocusError: true,
  })

  return (
    <FormProvider {...formMethods}>
      {multiplySlots ? (
        <MultiplySlotsCreatingForm {...props} />
      ) : (
        <SingleSlotCreatingForm {...props} />
      )}
    </FormProvider>
  )
}

type SingleSlotCreatingFormProps = CreateSlotsFormProps

const SingleSlotCreatingForm = (props: SingleSlotCreatingFormProps) => {
  const { onError, onSuccess, ...formProps } = props

  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext<CreateSlotForm, unknown, TransformedCreateSlotsFormData>()

  const [createSlotsMutation, { isLoading }] = useCreateSlotsMutation()

  const submitForm = async (formData: TransformedCreateSlotsFormData) => {
    const response = await createSlotsMutation({
      auctionId: auctionUUID,
      slots: formData,
    })

    if (response.error) {
      const error = response.error as AxiosBaseQueryError

      toastErrorNotification(
        'Не удалось добавить слот(-ы)',
        error.reason || error.message,
        { position: 'bottom-left' }
      )

      return onError && onError()
    }

    toastSuccessNotification('Слот успешно добавлен в аукцион!')
    onSuccess && onSuccess(formData)
  }

  return (
    <form
      className="flex w-full flex-col justify-between"
      onSubmit={handleSubmit(submitForm)}
      {...formProps}
    >
      <Flex className="w-full gap-y-6" direction="column">
        <SlotNameFormInput
          control={control}
          name={'slots.0.name'}
          errorMessage={getErrorMessageForField(errors, 'name', 0)}
        />
        <SlotPointsFormInput
          control={control}
          name={'slots.0.points'}
          errorMessage={getErrorMessageForField(errors, 'points', 0)}
        />
      </Flex>
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

type MultiplySlotsCreatingFormProps = CreateSlotsFormProps & {
  maxCreatingSlotsCount?: number
}

const MultiplySlotsCreatingForm = (props: MultiplySlotsCreatingFormProps) => {
  const { onSuccess, onError, maxCreatingSlotsCount = 10, ...formProps } = props
  const auctionUUID = useStoreSelector(auctionSelectors.getAuctionUUID)

  const [activeTabValue, setActiveTabValue] =
    useState<`slot-${string}`>('slot-0')

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useFormContext<CreateSlotForm, unknown, TransformedCreateSlotsFormData>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'slots',
  })

  const [createSlotsMutation, { isLoading }] = useCreateSlotsMutation()

  const submitForm = async (formData: TransformedCreateSlotsFormData) => {
    const response = await createSlotsMutation({
      auctionId: auctionUUID,
      slots: formData,
    })

    if (response.error) {
      const error = response.error as AxiosBaseQueryError

      toastErrorNotification(
        'Не удалось добавить слот(-ы)',
        error.reason || error.message,
        { position: 'bottom-left' }
      )

      return onError && onError()
    }

    toastSuccessNotification('Слоты успешно добавлены в аукцион!')
    onSuccess && onSuccess(formData)
  }

  const checkIsTabHasError = (tabIndex: number) => {
    if (!errors.slots) return false

    return !!errors.slots[tabIndex]
  }

  const renderFormFields = useCallback(
    (field: (typeof fields)[number], index: number) => {
      return (
        <m.li key={field.id} className="relative flex w-full flex-col gap-y-4">
          <SlotNameFormInput
            control={control}
            name={`slots.${index}.name` as const}
            errorMessage={getErrorMessageForField(errors, 'name', index)}
          />
          <SlotPointsFormInput
            control={control}
            name={`slots.${index}.points` as const}
            errorMessage={getErrorMessageForField(errors, 'points', index)}
          />
          {fields.length > 1 && (
            <Button
              variant={'error'}
              startContent={<Icons.Bin className="text-red" size="sm" />}
              onClick={() => {
                if (fields.length > 1) {
                  remove(index)
                  if (index === fields.length - 1) {
                    setActiveTabValue(`slot-${index - 1}`)
                  }
                }
              }}
            >
              Удалить слот
            </Button>
          )}
        </m.li>
      )
    },
    [fields, getErrorMessageForField, errors]
  )

  return (
    <form
      className="flex h-full w-full flex-col justify-between overflow-x-clip"
      onSubmit={handleSubmit(submitForm)}
      {...formProps}
    >
      <Tabs
        className="space-y-6 px-0.25"
        defaultValue={activeTabValue!}
        value={activeTabValue!}
        //@ts-expect-error slot value
        onValueChange={setActiveTabValue}
      >
        <Flex align="center">
          <TabsList className="flex w-fit justify-between rounded-large bg-dark">
            {fields.map((field, index) => (
              <TabsTrigger
                className={cn(
                  'flex cursor-pointer gap-x-1 text-md font-medium text-gray-light/70 hover:text-gray-light data-[state=active]:rounded-[8px] data-[state=active]:[&_button]:block',
                  checkIsTabHasError(index) &&
                    'text-red/80 hover:text-red data-[state=active]:text-red'
                )}
                key={field.id}
                value={`slot-${index}`}
              >
                Слот {index + 1}
              </TabsTrigger>
            ))}
            {fields.length < maxCreatingSlotsCount && (
              <Button
                variant={'ghost'}
                className="transition-colors hover:text-white/80"
                startContent={<Icons.Plus />}
                size={'sm'}
                onClick={() => {
                  append(DEFAULT_FORM_VALUE)
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
