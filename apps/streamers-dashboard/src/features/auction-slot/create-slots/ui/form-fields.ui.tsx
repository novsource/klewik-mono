import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react'
import { useMemo, useState } from 'react'

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
import type { NumberInputProps } from '~shared/ui/number-input'
import { NumberInput } from '~shared/ui/number-input'
import { Typography } from '~shared/ui/typograghy'

import { cn, mergeProps, twSlotsStyles } from '~shared/utils'
import { deleteAllSpacesFromString } from '~shared/utils/formatting'

import { CREATE_SLOT_FORM_DEFAULT_VALUE } from '../constants'
import { createSlotsFormFieldsStyles } from '../styles'

type ControllerFormInputProps<
  FormFields extends FieldValues | Record<string, FieldValues>,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
> = UseControllerProps<FormFields, Paths, TransformedValues>

const preventEnterFn = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.which === 13 /* Enter */) {
    event.preventDefault()
  }
}

export const SlotNameFormInput = <
  FormFields extends FieldValues,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
>(props: InputProps
  & ControllerFormInputProps<FormFields, Paths, TransformedValues> & {
    maxLength?: number
  }) => {
  const {
    control,
    name,
    maxLength = 35,
    ...inputProps
  } = props

  const [boundAnimationStatus, setBoundAnimationStatus] = useState<
    'inactive' | 'active'
  >('inactive')

  const { field: { onChange: fieldOnChange, ...field } } = useController({
    name,
    control,
  })

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > maxLength) {
      fieldOnChange(event.target.value.slice(0, maxLength))
      setBoundAnimationStatus('active')
    }
    else {
      fieldOnChange(event.target.value)
      setBoundAnimationStatus('inactive')
    }
  }

  const inputHandlers: InputProps = { onChange: handleOnChange, onKeyDown: preventEnterFn }

  const mergedInputProps = mergeProps(inputHandlers, inputProps)

  return (
    <Input
      label={{ id: `${name}`, value: 'Название слота' }}
      placeholder="Название слота"
      slotClassNames={{
        base: 'w-full basis-1/2 grow',
        description: 'text-wrap',
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
      {...field}
      {...mergedInputProps}
    />
  )
}

export type SlotPointsFormInputProps<
  FormFields extends FieldValues,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
> = {
  pointsInputProps?: NumberInputProps
  percentInputProps?: NumberInputProps
  minPercent?: number
  showPercentInput?: boolean
} & ControllerFormInputProps<FormFields, Paths, TransformedValues>

export const SlotPointsFormInput = <
  FormFields extends FieldValues,
  Paths extends FieldPath<FormFields>,
  TransformedValues extends FormFields,
>(props: SlotPointsFormInputProps<FormFields, Paths, TransformedValues>) => {
  const {
    control,
    name,
    percentInputProps,
    pointsInputProps,
    showPercentInput = true,
    minPercent = 0.1,
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
    const points = Number(deleteAllSpacesFromString(event.target.value))

    const pointsToPercents = (100 * points) / (points + slotsPointsSum)

    fieldOnChange(event.target.value)
    setPercentInputValue(pointsToPercents.toString())
    setPointsValue(points.toString())
  }

  const handlePointsInputBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const clearCurrentValue = deleteAllSpacesFromString(event.target.value)

    if (clearCurrentValue.length === 0 || Number(clearCurrentValue) < minPercent) {
      const defaultPointsValue = Number(CREATE_SLOT_FORM_DEFAULT_VALUE.points)
      const defaultPercents = (defaultPointsValue / (slotsPointsSum + defaultPointsValue)) * 100

      fieldOnChange(Math.floor(defaultPointsValue).toString())
      setPointsValue(Math.floor(defaultPointsValue).toString())
      setPercentInputValue(defaultPercents.toString())
    }
  }

  const handlePercentInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    const clearCurrentValue = deleteAllSpacesFromString(event.target.value)

    if (clearCurrentValue.length === 0 || Number(clearCurrentValue) < minPercent) {
      const defaultPointsValue = Number(CREATE_SLOT_FORM_DEFAULT_VALUE.points)
      const defaultPercents = (defaultPointsValue / (slotsPointsSum + defaultPointsValue)) * 100

      fieldOnChange(Math.floor(defaultPointsValue).toString())
      setPointsValue(Math.floor(defaultPointsValue).toString())
      setPercentInputValue(defaultPercents.toString())
    }
  }

  const pointsInputHandlers: NumberInputProps = {
    onChange: handlePointsInputChange,
    onBlur: handlePointsInputBlur,
    onKeyDown: preventEnterFn,
  }
  const percentsInputHandlers: NumberInputProps = {
    onChange: handlePercentInputChange,
    onBlur: handlePercentInputBlur,
    onKeyDown: preventEnterFn,
  }

  const mergedPointsInputProps = mergeProps(pointsInputProps, pointsInputHandlers)
  const mergedPercentsInputProps = mergeProps(percentsInputHandlers, percentInputProps)

  const styles = useMemo(() => twSlotsStyles(createSlotsFormFieldsStyles), [])

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
        // isAllowed={checkPointsBoundaries}
        {...field}
        {...mergedPointsInputProps}
      />
    )
  }

  return (
    <Flex className={styles.pointsInputsWrapper} align="start">
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
        // isAllowed={checkPointsBoundaries}
        {...field}
        {...mergedPointsInputProps}
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
            {'<'}
            99%
          </Typography>
        )}
        // isAllowed={checkPercentBoundaries}
        {...mergedPercentsInputProps}
      />
    </Flex>
  )
}
