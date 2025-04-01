import { HTMLAttributes, useMemo } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import { motion } from 'framer-motion'

import { auctionSelectors } from '~entities/auction/store'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import {
  AxiosBaseQueryError,
  useStoreSelector,
} from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { Input } from '~shared/ui/input'
import { NumberInput } from '~shared/ui/number-input'
import {
  toastErrorNotification,
  toastSuccessNotification,
} from '~shared/ui/toaster/lib'

import { useCreateSlotsMutation } from '../api'
import { TransformedCreateSlotsFormData, createSlotsFormResolver } from '../lib'
import { CreateSlotForm, FormArrayData } from '../model'

type CreateSlotsFormProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  multiplySlots?: boolean
  checkIsSlotsExists?: boolean
  onSuccess?: (formData: FormArrayData[]) => void
  onError?: () => void
}

export const CreateSlotsForm = ({
  multiplySlots,
  checkIsSlotsExists = true,
  onError,
  onSuccess,
  ...props
}: CreateSlotsFormProps) => {
  const auctionSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const auctionId = useStoreSelector(auctionSelectors.getAuctionId)

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CreateSlotForm, unknown, TransformedCreateSlotsFormData>({
    resolver: createSlotsFormResolver(auctionSlots),
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray<CreateSlotForm>({
    control,
    name: 'slots',
  })

  const [createSlotsMutation, { isLoading }] = useCreateSlotsMutation()

  const submitForm = async (formData: TransformedCreateSlotsFormData) => {
    const response = await createSlotsMutation({
      auctionId,
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

    toastSuccessNotification('Слот(-ы) успешно добавлен(-ы) в аукцион!')

    onSuccess && onSuccess(formData)
  }

  const getErrorMessageForField = (
    fieldName: keyof CreateSlotForm['slots'][number],
    fieldIndex: number
  ): string | undefined => {
    if (!('slots' in errors)) return undefined

    if (errors.slots === undefined) return undefined

    if (errors['slots'][fieldIndex] && errors['slots'][fieldIndex][fieldName]) {
      return errors['slots'][fieldIndex][fieldName].message
    }
  }

  const formFields = useMemo(() => {
    if (fields.length === 0) {
      append({ name: '', points: '10' })
      return
    }

    return (multiplySlots ? fields : fields.slice(0, 1)).map((field, index) => (
      <motion.li
        key={field.id}
        className="flex w-full gap-x-2 relative"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Controller
          render={({ field }) => (
            <Input
              slotClassNames={{
                base: 'w-full basis-1/2 grow',
                description: 'text-wrap',
                input: 'font-semibold',
              }}
              placeholder="Название слота"
              errorMessage={getErrorMessageForField('name', index)}
              {...field}
            />
          )}
          control={control}
          name={`slots.${index}.name` as const}
        />
        <Controller
          render={({ field }) => (
            <NumberInput
              slotClassNames={{
                base: 'w-full basis-1/3 desktop-lg:basis-1/4',
                description: 'text-wrap',
                input: 'font-golos-f font-medium',
              }}
              placeholder="Очки"
              maxValue={1000000}
              errorMessage={getErrorMessageForField('points', index)}
              {...field}
            />
          )}
          control={control}
          name={`slots.${index}.points` as const}
        />
        {multiplySlots && fields.length > 1 && (
          <Button
            className="transition-colors bg-red/10 text-red/60 hover:text-red hover:bg-red/20 text-sm"
            onClick={() => remove(index)}
          >
            Удалить
          </Button>
        )}
      </motion.li>
    ))
  }, [fields, getErrorMessageForField, multiplySlots])

  return (
    <Flex
      className="w-full h-full"
      component="form"
      justify="between"
      direction="column"
      onSubmit={handleSubmit(submitForm)}
      {...props}
    >
      <Flex className="w-full gap-y-6" direction="column" align="stretch">
        <Flex className="w-full" component="ul" direction="column">
          <Flex
            className="w-full h-full gap-y-3 overflow-y-scroll p-1"
            direction={'column'}
          >
            {formFields}
            {multiplySlots && (
              <Button
                className="w-fit"
                type="button"
                startContent={<Icons.Plus size="sm" />}
                size={'sm'}
                onClick={() => {
                  append({ name: '', points: '10' })
                  trigger('slots')
                }}
              >
                Создать слот
              </Button>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Button
        type="submit"
        variant="action"
        className="w-full"
        disabled={isLoading}
      >
        Добавить в аукцион
      </Button>
    </Flex>
  )
}
