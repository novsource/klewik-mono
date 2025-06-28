import type { ChangeEvent } from 'react'
import { useCallback, useState } from 'react'

import type {
  FieldPath,
  FieldValues,
  UseControllerProps,
} from 'react-hook-form'
import {
  useController,
} from 'react-hook-form'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import type { InputProps } from '~shared/ui/input'
import { Input } from '~shared/ui/input'
import { NumberInput } from '~shared/ui/number-input'
import { Typography } from '~shared/ui/typograghy'
import { cn, formatNumberToIntlString } from '~shared/utils'
import { deleteAllSpacesFromString } from '~shared/utils/string-format'

type ControllerFormInputProps<
  FormFields extends FieldValues | Record<string, FieldValues>,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
> = UseControllerProps<FormFields, Paths, TransformedValues>

const SlotNameFormInput = <
  FormFields extends FieldValues,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
>({
  control,
  name,
  maxLength = 35,
  ...props
}: InputProps
  & ControllerFormInputProps<FormFields, Paths, TransformedValues> & {
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
    }
    else {
      field.onChange(event.target.value)
      setBoundAnimationStatus('inactive')
    }
  }, [field, maxLength])

  return (
    <Input
      slotClassNames={{
        base: 'w-full basis-1/2 grow',
        description: 'text-wrap',
        input: 'font-semibold',
      }}
      endContent={(
        <Typography
          tag="span"
          className={cn(
            'text-md transition-colors select-none',
            boundAnimationStatus === 'active'
              ? 'animate-horizontal-shaking text-red'
              : 'text-gray-light',
          )}
          onAnimationEnd={() => {
            setBoundAnimationStatus('inactive')
          }}
        >
          {`${field.value.toString().length}/${maxLength}`}
        </Typography>
      )}
      label={{ id: `${name}`, value: 'Название слота' }}
      placeholder="Название слота"
      {...field}
      {...props}
      onChange={handleOnChange}
    />
  )
}

const SlotPointsFormInput = <
  FormFields extends FieldValues,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
>({
  control,
  name,
  maxValue = 10000000,
  ...props
}: Omit<InputProps, 'type'>
  & ControllerFormInputProps<FormFields, Paths, TransformedValues> & {
    maxValue?: number
  }) => {
  const {
    field: { value, ...field },
  } = useController({ name, control })

  const slotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum,
  )
  const [pointsValue, setPointsValue] = useState(() => {
    return Number(deleteAllSpacesFromString(value))
  })
  const [percentInputValue, setPercentInputValue] = useState(() => {
    return (pointsValue / (slotsPointsSum + pointsValue)) * 100
  })

  const onWinPercentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const percent = Number.parseFloat(deleteAllSpacesFromString(event.target.value))

    if (percent === 0) {
      return field.onChange('10')
    }

    const percentToValue = (slotsPointsSum * percent) / (100 - percent)

    field.onChange(formatNumberToIntlString(Math.floor(percentToValue)))
    setPointsValue(Math.floor(percentToValue))
  }

  const onPointsChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const points = Number(deleteAllSpacesFromString(event.target.value))

    const pointsToPercents = (100 * points) / (points + slotsPointsSum)

    field.onChange(event.target.value)
    setPercentInputValue(pointsToPercents)
    setPointsValue(points)
  }

  // useEffect(() => {
  //   const minPointsValue = Math.floor(slotsPointsSum * 0.5)

  //   if (pointsValue < minPointsValue) {
  //     setError(name, {
  //       message: `Минимальное количество очков - ${minPointsValue} (0.5%)`,
  //       type: 'custom',
  //     })
  //   } else {
  //     clearErrors(name)
  //   }
  // }, [slotsPointsSum])

  return (
    <Flex className="w-full gap-x-2" align="start">
      <NumberInput
        slotClassNames={{
          base: 'w-full grow',
          description: 'text-wrap',
          input: 'font-golos-f font-medium',
        }}
        decimalScale={0}
        thousandSeparator=" "
        label={{ id: `slot-points-${name}`, value: 'Очки слота' }}
        placeholder="Очки"
        allowNegative={false}
        startContent={<Icons.Coin className="text-gray-light" size="lg" />}
        value={value}
        {...field}
        isAllowed={(values) => {
          const { floatValue } = values
          const maxPointsValue = Math.floor(slotsPointsSum * 99)

          if (!floatValue)
            return true

          return floatValue <= maxPointsValue
        }}
        onChange={onPointsChangeHandler}
        {...props}
      />
      <NumberInput
        value={percentInputValue}
        slotClassNames={{ input: 'font-golos-f' }}
        label={{ id: `${name}.percent`, value: 'Шанс победы' }}
        placeholder="Шанс"
        allowNegative={false}
        decimalScale={2}
        endContent={(
          <Typography tag="span" className="text-nowrap text-gray-light">
            0.5-99%
          </Typography>
        )}
        isAllowed={(values) => {
          const { floatValue } = values

          if (floatValue === undefined)
            return true

          return floatValue <= 99
        }}
        onChange={onWinPercentChangeHandler}
      />
    </Flex>
  )
}

export { SlotNameFormInput, SlotPointsFormInput }
