import { HTMLAttributes, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { auctionSelectors } from '~entities/auction/store'

import { AuctionSlot } from '~entities/auction-slot/model'

import {
  AxiosBaseQueryError,
  useStoreSelector,
} from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Input } from '~shared/ui/input'
import { NumberInput } from '~shared/ui/number-input'
import {
  toastErrorNotification,
  toastSuccessNotification,
} from '~shared/ui/toaster/lib'

import { useEditSlotMutation } from '../api'
import { TransformedEditSlotFormData, transformEditSlotFormData } from '../lib'
import type { EditSlotFormData } from '../model'

type EditSlotsFormProps = Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  targetSlot: AuctionSlot
  onSuccess?: (formData: TransformedEditSlotFormData) => void
  onError?: () => void
}

export const EditSlotForm = ({
  targetSlot,
  onError,
  onSuccess,
  ...props
}: EditSlotsFormProps) => {
  const auctionId = useStoreSelector(auctionSelectors.getAuctionId)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EditSlotFormData, unknown, TransformedEditSlotFormData>({
    defaultValues: {
      name: targetSlot.name,
      points: Intl.NumberFormat('ru-RU').format(targetSlot.points).toString(),
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

  const getErrorMessageForField = (
    fieldName: keyof EditSlotFormData
  ): string | undefined => {
    if (errors[fieldName]) {
      return errors[fieldName].message
    }
  }

  const formFields = useMemo(() => {
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
  }, [getErrorMessageForField])

  return (
    <form
      className="flex flex-col w-full h-full justify-between"
      onSubmit={handleSubmit(submitForm)}
      {...props}
    >
      <div className="flex w-full flex-col gap-y-6 items-stretch">
        <ul className="flex flex-col w-full">
          <div className="flex w-full flex-col gap-y-3 h-full overflow-y-scroll p-1">
            {formFields}
          </div>
        </ul>
      </div>

      <Button
        type="submit"
        variant={'action'}
        className="w-full"
        disabled={isLoading}
      >
        Изменить слот
      </Button>
    </form>
  )
}
