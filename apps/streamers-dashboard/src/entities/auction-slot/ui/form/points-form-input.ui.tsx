import type { FlexProps } from 'klewik-ui/flex'
import type { NumberInputProps } from 'klewik-ui/number-input'

import type { ChangeEvent, KeyboardEvent } from 'react'
import { useState } from 'react'

import type { FieldPath, FieldValues, UseControllerProps } from 'react-hook-form'
import { useController } from 'react-hook-form'

import { Flex } from 'klewik-ui/flex'
import { Icons } from 'klewik-ui/icons'
import { NumberInput } from 'klewik-ui/number-input'
import { Typography } from 'klewik-ui/typograghy'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { deleteAllSpacesFromString, isStringEmpty, mergeProps } from '~shared/utils'

const preventEnterFn = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.which === 13 /* Enter */) {
    event.preventDefault()
  }
}

export type SlotPointsFormInputProps<
  FormFields extends FieldValues,
  Paths extends FieldPath<FormFields>,
  TransformedValues,
> = {
  containerProps?: FlexProps
  pointsInputProps?: NumberInputProps
  percentInputProps?: NumberInputProps
  minPercent?: number
  showPercentInput?: boolean
} & UseControllerProps<FormFields, Paths, TransformedValues>

export const SlotPointsFormInput = <
  FormFields extends FieldValues,
  Paths extends FieldPath<FormFields>,
  TransformedValues,
>(props: SlotPointsFormInputProps<FormFields, Paths, TransformedValues>) => {
  const {
    control,
    name,
    percentInputProps,
    containerProps,
    pointsInputProps,
    showPercentInput = true,
    ...pointsControllerProps
  } = props

  const {
    field: { value, onChange: fieldOnChange, ...field },
  } = useController({ name, control, ...pointsControllerProps })

  const slotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum,
  )
  const [pointsValue, setPointsValue] = useState(() => {
    return deleteAllSpacesFromString(value)
  })
  const [percentInputValue, setPercentInputValue] = useState(() => {
    const pointsNumValue = Number(pointsValue)

    return String((pointsNumValue / (slotsPointsSum + pointsNumValue)) * 100)
  })

  const handlePercentInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const percent = Number.parseFloat(deleteAllSpacesFromString(event.target.value))

    const percentToValue = (slotsPointsSum * percent) / (100 - percent)

    fieldOnChange(String(Math.floor(percentToValue)))
    setPointsValue(Math.floor(percentToValue).toString())
    setPercentInputValue(percent.toString())
  }

  const handlePointsInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isStringEmpty(event.target.value)) {
      fieldOnChange(event.target.value)
      setPercentInputValue('')
      setPointsValue('')
    }

    const points = Number(deleteAllSpacesFromString(event.target.value))

    const pointsToPercents = (100 * points) / (points + slotsPointsSum)

    fieldOnChange(event.target.value)
    setPercentInputValue(pointsToPercents.toString())
    setPointsValue(points.toString())
  }

  // const handlePointsInputBlur = (event: ChangeEvent<HTMLInputElement>) => {
  //   const clearCurrentValue = deleteAllSpacesFromString(event.target.value)

  //   if (clearCurrentValue.length === 0 || Number(clearCurrentValue) < minPercent) {
  //     const defaultPointsValue = Number(pointsInputProps?.defaultValue ?? 1000)
  //     const defaultPercents = (defaultPointsValue / (slotsPointsSum + defaultPointsValue)) * 100

  //     fieldOnChange(Math.floor(defaultPointsValue).toString())
  //     setPointsValue(Math.floor(defaultPointsValue).toString())
  //     setPercentInputValue(defaultPercents.toString())
  //   }
  // }

  // const handlePercentInputBlur = (event: FocusEvent<HTMLInputElement>) => {
  //   const clearCurrentValue = deleteAllSpacesFromString(event.target.value)

  //   if (clearCurrentValue.length === 0 || Number(clearCurrentValue) < minPercent) {
  //     const defaultPointsValue = Number(pointsInputProps?.defaultValue ?? 1000)
  //     const defaultPercents = (defaultPointsValue / (slotsPointsSum + defaultPointsValue)) * 100

  //     fieldOnChange(Math.floor(defaultPointsValue).toString())
  //     setPointsValue(Math.floor(defaultPointsValue).toString())
  //     setPercentInputValue(defaultPercents.toString())
  //   }
  // }

  const pointsInputHandlers: NumberInputProps = {
    onChange: handlePointsInputChange,
    // onBlur: handlePointsInputBlur,
    onKeyDown: preventEnterFn,
  }
  const percentsInputHandlers: NumberInputProps = {
    onChange: handlePercentInputChange,
    // onBlur: handlePercentInputBlur,
    onKeyDown: preventEnterFn,
  }

  const mergedPointsInputProps = mergeProps(pointsInputHandlers, pointsInputProps)
  const mergedPercentsInputProps = mergeProps(percentsInputHandlers, percentInputProps)

  if (!showPercentInput) {
    return (
      <NumberInput
        slotClassNames={{
          base: 'w-full grow',
          description: 'text-wrap',
          input: 'font-golos-f font-medium',
        }}
        label={{ id: `${name}`, value: 'Очки слота' }}
        placeholder="Очки"
        value={value}
        startContent={<Icons.Coin className="text-gray-light" size="lg" />}
        thousandSeparator=" "
        decimalScale={0}
        allowNegative={false}
        valueBounds={{ max: Math.floor(slotsPointsSum * 99) }}
        {...field}
        {...mergedPointsInputProps}
      />
    )
  }

  return (
    <Flex align="start" {...containerProps}>
      <NumberInput
        slotClassNames={{
          base: 'w-full grow',
          description: 'text-wrap',
          input: 'font-golos-f font-medium',
        }}
        label={{ id: `${name}`, value: 'Очки слота' }}
        placeholder="Очки"
        value={pointsValue}
        startContent={<Icons.Coin className="text-gray-light" size="lg" />}
        thousandSeparator=" "
        decimalScale={0}
        allowNegative={false}
        valueBounds={{ max: Math.floor(slotsPointsSum * 99) }}
        {...field}
        {...mergedPointsInputProps}
      />
      <NumberInput
        value={percentInputValue}
        slotClassNames={{ input: 'font-golos-f' }}
        label={{ id: `${name}.percent`, value: 'Шанс победы' }}
        placeholder="Шанс"
        allowNegative={false}
        allowLeadingZeros={false}
        decimalScale={2}
        valueBounds={{ max: 99 }}
        endContent={(
          <Typography tag="span" className="text-nowrap text-gray-light">
            {'<'}
            99%
          </Typography>
        )}
        {...mergedPercentsInputProps}
      />
    </Flex>
  )
}
