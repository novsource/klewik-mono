import type { SlotsPageContextValue } from '../../context/slots-page.context'

import { useState } from 'react'
import type { ReactNode } from 'react'

import { Icons } from 'klewik-ui/icons'
import { Select, SelectContent, SelectItem, SelectList, SelectTrigger } from 'klewik-ui/select'

import { useSlotsPageContext } from '../../context/slots-page.context'

type FilterSlotStatusItem = {
  label: string
  value: SlotsPageContextValue['state']['filterSlotsOptions']['status']
  icon?: ReactNode
}

const filterSlotsStatuses: FilterSlotStatusItem[] = [
  {
    label: 'Все статусы',
    value: 'all',
  },
  {
    label: 'Участвуют',
    value: 'alived',
    icon: <Icons.Heart className="text-red" size="xs" />,
  },
  {
    label: 'Выбыли',
    value: 'dropped',
    icon: <Icons.BrokenHeart size="xs" />,
  },
]

export const FilterSlotsStatusSelect = () => {
  const { state: { filterSlotsOptions: { status } }, dispatch: { updateFilterSlotsOptions } } = useSlotsPageContext()

  const [selectedStatus, setSelectedStatus] = useState<NullablePossible<typeof filterSlotsStatuses[number]>>(() => {
    const initialStatusItem = filterSlotsStatuses.find(item => item.value === status)!

    return initialStatusItem
  })

  const handleOnValueChange = (item: typeof selectedStatus) => {
    setSelectedStatus(item)

    if (item?.value) {
      updateFilterSlotsOptions({ status: item.value })
    }
  }

  return (
    <Select
      items={filterSlotsStatuses}
      value={selectedStatus}
      onValueChange={value => handleOnValueChange(value)}
      multiple={false}
    >
      <SelectTrigger className="text-gray-accent" leftIcon={selectedStatus?.icon} placeholder="Все статусы" />
      <SelectContent alignItemWithTrigger={false} align="start" sideOffset={8}>
        <SelectList>
          {
            filterSlotsStatuses.map(item => (
              <SelectItem
                key={item.value}
                icon={item.icon}
                label={item.label}
                value={item}
              />
            ))
          }
        </SelectList>
      </SelectContent>
    </Select>
  )
}
