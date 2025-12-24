import type { SelectRootChangeEventDetails } from '@base-ui-components/react'

import { useState } from 'react'

import type { ProcessedDonationStatus } from '~entities/donation/model'

import { DONATION_STATUS_NAME } from '~shared/constants/donations'

import { Icons } from '~shared/ui/icons'
import type {
  SelectProps,
} from '~shared/ui/select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
} from '~shared/ui/select'

type DisplayedSelectItemData = {
  value: NullablePossible<ProcessedDonationStatus>
  label: string
}

const selectItems: DisplayedSelectItemData[] = [
  {
    value: null,
    label: 'Все статусы',
  },
  {
    value: 'added',
    label: DONATION_STATUS_NAME.added,
  },
  {
    value: 'checkRequested',
    label: DONATION_STATUS_NAME.confirm,
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
  {
    value: 'inProgress',
    label: 'В процессе',
  },
]

type DonationsProcessStatusFilterProps = SelectProps<NullablePossible<ProcessedDonationStatus>, false> & {
  status?: NullablePossible<ProcessedDonationStatus>
}

export const DonationsStatusFilterSelect = (
  props: DonationsProcessStatusFilterProps,
) => {
  const { status, onValueChange, ...selectProps } = props

  const [selectedStatus, setSelectedStatus] = useState<NullablePossible<ProcessedDonationStatus>>(status ?? null)

  const handleOnValueChange = (status: NullablePossible<ProcessedDonationStatus>, event: SelectRootChangeEventDetails) => {
    setSelectedStatus(status)
    onValueChange?.(status, event)
  }

  return (
    <Select
      items={selectItems}
      value={selectedStatus}
      size="sm"
      onValueChange={handleOnValueChange}
      {...selectProps}
    >
      <SelectTrigger className="text-gray-light" leftIcon={<Icons.Status size="xs" />} />
      <SelectContent sideOffset={4}>
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
