import { HTMLAttributes, useEffect, useMemo } from 'react'
import {
  Control,
  Controller,
  DefaultValues,
  FormState,
  useForm,
  useWatch,
} from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { auctionSelectors } from '~entities/auction/store'

import { AuctionSlot } from '~entities/auction-slot/model'

import {
  AxiosBaseQueryError,
  useStoreSelector,
} from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Input } from '~shared/ui/input'
import { NumberInput } from '~shared/ui/number-input'
import {
  toastErrorNotification,
  toastSuccessNotification,
} from '~shared/ui/toaster/lib'

import { useEditSlotMutation } from '../api'
import { TransformedEditSlotFormData, transformEditSlotFormData } from '../lib'
import type { EditSlotFormData } from '../model'

type EditSlotFormWatchingProps<
  T extends Partial<Record<keyof EditSlotFormData, boolean>> = Partial<
    Record<keyof EditSlotFormData, boolean>
  >,
  Return extends Extract<keyof T, keyof EditSlotFormData> = Extract<
    keyof T,
    keyof EditSlotFormData
  >,
> = {
  watchingFields?: T
  onFieldValueChange?: (
    data: Partial<Record<Return, EditSlotFormData[Return]>>
  ) => void
}

type EditSlotsFormStateProps = {
  defaultValues?: DefaultValues<EditSlotFormData>
}

type EditSlotsFormProps = Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  targetSlot: AuctionSlot
  onSuccess?: (formData: TransformedEditSlotFormData) => void
  onError?: () => void
} & EditSlotFormWatchingProps &
  EditSlotsFormStateProps

export const EditSlotForm = ({
  targetSlot,
  onError,
  onSuccess,
  defaultValues,
  watchingFields,
  onFieldValueChange,
  ...props
}: EditSlotsFormProps) => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionUUID)

  const { control, handleSubmit, formState } = useForm<
    EditSlotFormData,
    unknown,
    TransformedEditSlotFormData
  >({
    defaultValues: {
      name: defaultValues?.name ?? targetSlot.name,
      points: Intl.NumberFormat('ru-RU')
        .format(Number(defaultValues?.points) || targetSlot.points)
        .toString(),
    },
    resolver: zodResolver(transformEditSlotFormData()),
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const [editSlotMutation, { isLoading }] = useEditSlotMutation()

  const submitForm = async (formData: TransformedEditSlotFormData) => {
    const response = await editSlotMutation({
      auctionId,
      slot: { id: targetSlot.id, ...formData },
    })

    if (response.error) {
      const error = response.error as AxiosBaseQueryError

      toastErrorNotification(
        'Не удалось изменить слот',
        error.reason || error.message,
        { position: 'bottom-left' }
      )

      return onError && onError()
    }

    toastSuccessNotification('Слот успешно изменен!')

    onSuccess && onSuccess(formData)
  }

  return (
    <Flex
      className="w-full h-full"
      component="form"
      direction="column"
      justify="between"
      onSubmit={handleSubmit(submitForm)}
      {...props}
    >
      <Flex className="w-full gap-y-6" direction="column" align="stretch">
        <Flex className="w-full" component={'ul'} direction={'column'}>
          <Flex
            className="w-full h-full overflow-y-scroll p-1 gap-y-3"
            direction="column"
          >
            <EditSlotFormFields
              control={control}
              formState={formState}
              watchingFields={watchingFields}
              onFieldValueChange={onFieldValueChange}
            />
          </Flex>
        </Flex>
      </Flex>
      <Button
        type="submit"
        variant={'action'}
        className="w-full"
        disabled={isLoading}
      >
        Изменить слот
      </Button>
    </Flex>
  )
}

type EditSlotFormFieldsProps = {
  formState: FormState<EditSlotFormData>
  control: Control<EditSlotFormData>
} & EditSlotFormWatchingProps

const EditSlotFormFields = ({
  control,
  formState,
  watchingFields,
  onFieldValueChange,
}: EditSlotFormFieldsProps) => {
  const watchedFieldsNames = useMemo(() => {
    if (!watchingFields || Object.keys(watchingFields).length === 0) return []

    const fields = Object.keys(watchingFields) as Array<keyof EditSlotFormData>

    return fields.reduce<Array<keyof EditSlotFormData>>((acc, name) => {
      const isWatching = watchingFields[name]

      if (isWatching) {
        acc.push(name)
      }

      return acc
    }, [])
  }, [watchingFields])

  const fieldsValues = useWatch({ control, name: watchedFieldsNames })

  useEffect(() => {
    if (!watchingFields || Object.keys(watchedFieldsNames).length === 0) return

    let counter = 0

    const transformedData = fieldsValues.reduce<{
      [P in keyof EditSlotFormData]?: EditSlotFormData[P]
    }>((acc, value) => {
      const fieldName = watchedFieldsNames[counter]
      acc[fieldName] = value
      counter++

      return acc
    }, {})

    onFieldValueChange && onFieldValueChange(transformedData)
  }, [fieldsValues, watchedFieldsNames])

  const getErrorMessageForField = (
    fieldName: keyof EditSlotFormData
  ): string | undefined => {
    if (formState.errors[fieldName]) {
      return formState.errors[fieldName].message
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <Controller
        render={({ field }) => (
          <Input
            slotClassNames={{
              base: 'font-golos-f w-full basis-1/2 grow',
              description: 'text-wrap',
            }}
            label={{ id: 'slotTitle', value: 'Новое название' }}
            placeholder="Название слота"
            errorMessage={getErrorMessageForField('name')}
            {...field}
          />
        )}
        control={control}
        name={'name'}
      />
      <Controller
        render={({ field }) => (
          <NumberInput
            slotClassNames={{
              base: 'font-golos-f basis-1/3 desktop-lg:basis-1/4',
              description: 'text-wrap',
            }}
            label={{
              id: 'slotPoints',
              value: 'Новое количество очков',
            }}
            placeholder="Очки"
            maxValue={1000000}
            errorMessage={getErrorMessageForField('points')}
            {...field}
          />
        )}
        control={control}
        name={'points'}
      />
    </div>
  )
}
