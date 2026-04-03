import { memo } from 'react'

import type { OnValueChange } from 'react-number-format'

import { useUnmount } from '~shared/hooks'

import { Icons } from 'klewik-ui/icons'
import { NumberInput } from 'klewik-ui/number-input'
import type { NumberInputProps } from 'klewik-ui/number-input'

export type SlotPointsInputProps = Omit<NumberInputProps, 'onInput' | 'slot'> & {
  onInput?: (value: Maybe<number>) => void
}

export const SlotPointsInput = memo((props: SlotPointsInputProps) => {
  const { onInput, onValueChange, ...restProps } = props

  const handleOnValueChange: OnValueChange = (values, sourceInfo) => {
    const { floatValue } = values

    onValueChange?.(values, sourceInfo)
    onInput?.(floatValue)

    // setValue(floatValue)
    // updateSlot({ id: slot.id, data: { points: floatValue } })
  }

  useUnmount(() => console.log('here'))

  return (
    <NumberInput
      variant="ghost"
      slotClassNames={{ input: 'font-golos-f text-title' }}
      startContent={<Icons.Coin className="text-gray-light" />}
      thousandSeparator=" "
      decimalScale={0}
      allowNegative={false}
      onValueChange={handleOnValueChange}
      {...restProps}
    />
  )
})
