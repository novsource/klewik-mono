import {
  ChangeEvent,
  HTMLAttributes,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react'
import {
  ControllerProps,
  useController,
  useFieldArray,
  useForm,
} from 'react-hook-form'

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
import { Input, InputProps } from '~shared/ui/input'
import { NumberInput, NumberInputProps } from '~shared/ui/number-input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~shared/ui/tabs'
import {
  toastErrorNotification,
  toastSuccessNotification,
} from '~shared/ui/toaster/lib'
import { Typography } from '~shared/ui/typograghy'

import { cn } from '~shared/utils'

import { useCreateSlotsMutation } from '../api'
import { TransformedCreateSlotsFormData, createSlotsFormResolver } from '../lib'
import { CreateSlotForm, FormArrayData } from '../model'

type CreateSlotsFormProps = Omit<
  HTMLAttributes<HTMLFormElement>,
  'onSubmit'
> & {
  multiplySlots?: boolean
  multiplySlotsCount?: number
  checkIsSlotsExists?: boolean
  fieldsRules?: Record<
    keyof FormArrayData,
    { maxSize?: number; minSize?: number }
  >
  onSuccess?: (formData: FormArrayData[]) => void
  onError?: () => void
}

export const CreateSlotsForm = ({
  multiplySlots,
  multiplySlotsCount = 4,
  checkIsSlotsExists = true,
  fieldsRules,
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
    defaultValues: { slots: [{ name: '', points: '10' }] },
    resolver: createSlotsFormResolver(auctionSlots),
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const { fields, append, remove } = useFieldArray<CreateSlotForm>({
    control,
    name: 'slots',
  })

  useLayoutEffect(() => {}, [])

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

  const getErrorMessageForField = useCallback(
    (
      fieldName: keyof CreateSlotForm['slots'][number],
      fieldIndex: number
    ): string | undefined => {
      if (!('slots' in errors) || errors.slots === undefined) return undefined

      if (
        errors['slots'][fieldIndex] &&
        errors['slots'][fieldIndex][fieldName]
      ) {
        return errors['slots'][fieldIndex][fieldName].message
      }
    },
    [errors]
  )

  const checkIsTabHasError = (tabIndex: number) => {
    if (!errors.slots) return false

    return !!errors.slots[tabIndex]
  }

  const getFormFields = useCallback(
    (field: (typeof fields)[number], index: number) => {
      return (
        <motion.li
          key={field.id}
          className="flex flex-col w-full gap-y-4 relative"
        >
          <SlotNameFormInput
            control={control}
            name={`slots.${index}.name` as const}
            errorMessage={getErrorMessageForField('name', index)}
          />
          <SlotPointsFormInput
            control={control}
            name={`slots.${index}.points` as const}
            errorMessage={getErrorMessageForField('points', index)}
          />

          {multiplySlots && fields.length > 1 && (
            <Button
              variant={'error'}
              onClick={() => remove(index)}
              startContent={<Icons.Bin size="xs" />}
            >
              Удалить слот
            </Button>
          )}
        </motion.li>
      )
    },
    [fields, getErrorMessageForField, multiplySlots]
  )

  if (!multiplySlots) {
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
              {getFormFields(fields[0], 0)}
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

  return (
    <Flex
      component={'form'}
      className="w-full h-full"
      direction="column"
      justify="between"
      onSubmit={handleSubmit(submitForm)}
    >
      <Tabs className="space-y-6" defaultValue="slot-0">
        <Flex align="center" justify="between">
          <TabsList className="flex w-fit justify-between rounded-large bg-dark">
            {fields.map((field, index) => (
              <TabsTrigger
                className={cn(
                  'flex gap-x-2 text-md font-medium data-[state=active]:rounded-[8px] cursor-pointer text-gray-light/70 hover:text-gray-light',
                  checkIsTabHasError(index) &&
                    'text-red/80 hover:text-red data-[state=active]:text-red'
                )}
                key={field.id}
                value={`slot-${index}`}
              >
                Слот {index + 1}
              </TabsTrigger>
            ))}

            {multiplySlots && fields.length < multiplySlotsCount && (
              <Button
                className="w-fit"
                variant={'ghost'}
                startContent={<Icons.Plus />}
                type="button"
                size={'sm'}
                onClick={() => {
                  append({ name: '', points: '10' })
                  trigger('slots')
                }}
              />
            )}
          </TabsList>
        </Flex>

        {fields.map((field, index) => {
          return (
            <TabsContent value={`slot-${index}`} key={field.id}>
              {getFormFields(field, index)}
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
    </Flex>
  )
}

const SlotNameFormInput = ({
  control,
  name,
  maxLength = 35,
  ...props
}: InputProps &
  ControllerProps & {
    maxLength?: number
  }) => {
  const [boundAnimationStatus, setBoundAnimationStatus] = useState<
    'inactive' | 'active'
  >('inactive')

  const { field } = useController({
    name,
    control,
  })

  const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > maxLength) {
      field.onChange(event.target.value.slice(0, maxLength))
      setBoundAnimationStatus('active')
    } else {
      field.onChange(event.target.value)
      setBoundAnimationStatus('inactive')
    }
  }, [])

  return (
    <Input
      slotClassNames={{
        base: 'w-full basis-1/2 grow',
        description: 'text-wrap',
        input: 'font-semibold',
      }}
      endContent={
        <Typography
          tag="span"
          className={cn(
            'text-md transition-colors',
            boundAnimationStatus === 'active'
              ? 'animate-horizontal-shaking text-red'
              : 'text-gray'
          )}
          onAnimationEnd={() => {
            setBoundAnimationStatus('inactive')
          }}
        >
          {`${field.value.toString().length}/${maxLength}`}
        </Typography>
      }
      label={{ id: `${name}`, value: 'Название слота' }}
      placeholder="Название слота"
      {...field}
      {...props}
      onChange={handleOnChange}
    />
  )
}

const SlotPointsFormInput = ({
  control,
  name,
  maxValue = 10000000,
  ...props
}: NumberInputProps &
  ControllerProps & {
    maxValue?: number
  }) => {
  const { field } = useController({ name, control })

  return (
    <NumberInput
      slotClassNames={{
        base: 'w-full basis-1/3 desktop-lg:basis-1/4',
        description: 'text-wrap',
        input: 'font-golos-f font-medium',
      }}
      label={{ id: `slot-points-${name}`, value: 'Очки слота' }}
      placeholder="Очки"
      minValue={10}
      maxValue={maxValue}
      allowDeleteMinValue
      {...field}
      {...props}
    />
  )
}
