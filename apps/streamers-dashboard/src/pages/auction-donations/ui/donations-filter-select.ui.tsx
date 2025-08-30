import { useRef, useState } from 'react'

import { DONATION_PROCESSED_STATUS } from '~entities/donation/constants'
import type { ProcessedDonationStatus } from '~entities/donation/model'

import { Icons } from '~shared/ui/icons'
import type {
  SelectProps,
} from '~shared/ui/select'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~shared/ui/select'

type DonationsProcessStatusFilterProps = SelectProps & {
  status?: NullablePossible<ProcessedDonationStatus>
}

export const DonationsFilterSelect = (
  props: DonationsProcessStatusFilterProps,
) => {
  const { status, onValueChange, ...selectProps } = props

  const [filterValue, setFilterValue] = useState<NullablePossible<ProcessedDonationStatus>>(status ?? null)

  const resetToDefaultRef = useRef(false)

  return (
    <Select
      value={filterValue || ''}
      size="sm"
      onValueChange={(status: ProcessedDonationStatus) => {
        if (resetToDefaultRef.current) {
          resetToDefaultRef.current = false

          return onValueChange && onValueChange('')
        }

        setFilterValue(status)
        onValueChange && onValueChange(status)
      }}
      {...selectProps}
    >
      <SelectTrigger className="text-gray-light">
        <Icons.Status size="xs" />
        <SelectValue placeholder="Cтатус" />
      </SelectTrigger>
      <SelectContent sideOffset={4}>
        <SelectGroup>
          {(Object.keys(DONATION_PROCESSED_STATUS) as Array<keyof typeof DONATION_PROCESSED_STATUS>).map(status => (
            <SelectItem
              key={status}
              value={status}
              onPointerDown={() => {
                if (filterValue === status) {
                  resetToDefaultRef.current = true

                  setFilterValue(null)
                }
              }}
            >
              {DONATION_PROCESSED_STATUS[status]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
