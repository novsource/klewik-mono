import { useState } from 'react'
import type { ChangeEvent } from 'react'

import { useDebounceCallback, useUnmount } from '~shared/hooks'

import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'

import { useLocalAuctionSlotsPageContext } from '../../context/local-auction-slots-page.context'

export const LocalSearchSlotsInput = () => {
  const pageContext = useLocalAuctionSlotsPageContext()

  const [inputValue, setInputValue] = useState('')

  const debouncedSearch = useDebounceCallback(() => {
    return pageContext.dispatch.setSearchQuery(inputValue)
  }, 250)

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = event

    setInputValue(value)
    debouncedSearch()
  }

  useUnmount(() => debouncedSearch.cancel())

  return (
    <Input
      value={inputValue}
      onChange={handleOnChange}
      slotClassNames={{ base: 'min-w-[280px]', input: 'text-title overflow-ellipsis text-nowrap overflow-hidden' }}
      placeholder="Поиск по названию..."
      startContent={<Icons.Magnifier className="text-gray-light" />}
      size="lg"
    />
  )
}
