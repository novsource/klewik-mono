import type { ProcessedDonationStatus } from '~entities/donation/model'

import { DONATION_STATUS_NAME } from '~shared/constants/donations'
import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery, useUrlSearchParam } from '~shared/hooks'

import { Icons } from 'klewik-ui/icons'
import type {
  SelectProps,
} from 'klewik-ui/select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
} from 'klewik-ui/select'

import { cn } from '~shared/utils'

export type DonationsStatusFilterValue = ProcessedDonationStatus | 'all'

type DisplayedSelectItemData = {
  value: DonationsStatusFilterValue
  label: typeof DONATION_STATUS_NAME[keyof typeof DONATION_STATUS_NAME] | 'Все статусы'
}

const selectItems: DisplayedSelectItemData[] = [
  {
    value: 'all',
    label: 'Все статусы',
  },
  {
    value: 'added',
    label: DONATION_STATUS_NAME.added,
  },
  {
    value: 'checkRequested',
    label: DONATION_STATUS_NAME.checkRequested,
  },
  {
    value: 'empty',
    label: DONATION_STATUS_NAME.empty,
  },
  {
    value: 'error',
    label: DONATION_STATUS_NAME.error,
  },
  {
    value: 'rejected',
    label: DONATION_STATUS_NAME.rejected,
  },
]

export type DonationsStatusFilterValueProps = Omit<SelectProps<DonationsStatusFilterValue, false>, 'onValueChange'> & {
  className?: string
  status?: DonationsStatusFilterValue
  onValueChange?: (status: DonationsStatusFilterValue) => void
}

export const DonationsStatusFilterSelect = (
  props: DonationsStatusFilterValueProps,
) => {
  const { className, status, onValueChange, ...selectProps } = props

  const { set, value } = useUrlSearchParam<DonationsStatusFilterValue>('status', { initialValue: status ?? 'all' })

  const handleOnValueChange = (status: NullablePossible<DonationsStatusFilterValue>) => {
    const safeStatus = status || 'all'

    set(safeStatus)
    onValueChange?.(safeStatus)
  }

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <Select
      items={selectItems}
      value={value}
      defaultValue={value ?? status ?? 'all'}
      onValueChange={handleOnValueChange}
      size={isLargeThenTablet ? 'default' : 'sm'}
      {...selectProps}
    >
      <SelectTrigger className={cn('text-gray-light', className)} leftIcon={<Icons.Tag size="sm" />} size="sm" />
      <SelectContent sideOffset={8} align="start" alignItemWithTrigger={false}>
        <SelectList>
          {selectItems.map(item => (
            <SelectItem
              key={item.value}
              value={item.value}
              label={item.label}
            />
          ))}
        </SelectList>
      </SelectContent>
    </Select>
  )
}
