'use client'

import type { InputProps } from 'klewik-ui/input'
import { useMediaQuery } from '~hooks/index'

import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'
import { greaterThenDeviceWidthMediaQueries } from '~/constants'

type SearchSlotsInputProps = InputProps

export const SearchSlotsInput = (props: SearchSlotsInputProps) => {
  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <Input
      slotClassNames={{ base: 'max-w-[400px] grow', input: 'text-sm tablet:text-md' }}
      placeholder="Искать..."
      startContent={<Icons.Magnifier className="text-gray" size="sm" />}
      size={isLargeThenTablet ? 'default' : 'sm'}
      {...props}
    />
  )
}
