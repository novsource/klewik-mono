import type { ChangeEvent } from 'react'
import { memo } from 'react'

import type { InputProps } from 'klewik-ui/input'
import { Input } from 'klewik-ui/input'

export type SlotTitleInputProps = Omit<InputProps, 'onInput' | 'slot'> & {
  onInput?: (value: string) => void
}

export const SlotTitleInput = memo((props: SlotTitleInputProps) => {
  const { onInput, onChange, ...restProps } = props

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    onChange?.(event)
    onInput?.(value)
  }

  return (
    <Input
      variant="ghost"
      slotClassNames={{
        base: 'w-full grow',
        wrapper: 'px-2',
        input: 'text-base font-semibold text-title overflow-ellipsis text-nowrap overflow-hidden',
      }}
      size="lg"
      onChange={handleOnChange}
      {...restProps}
    />
  )
})
