import { useState } from 'react'

import type { ProcessedDonation } from '~entities/donation/model'

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

export type DonationPageProcessStatus = ProcessedDonation['processData']['status'] | 'all'

const donationProccessStatus: Array<DonationPageProcessStatus> = [
  'all',
  'added',
  'checkRequested',
  'empty',
  'error',
]

type DonationsProcessStatusFilterProps = SelectProps & {
  status?: DonationPageProcessStatus
}

export const DonationsFilterSelect = (
  props: DonationsProcessStatusFilterProps,
) => {
  const { status, onValueChange, ...selectProps } = props

  const [filterValue, setFilterValue] = useState<DonationPageProcessStatus>(
    status ?? 'all',
  )

  const donationProccessStatusItemText: Record<DonationPageProcessStatus, string>
    = {
      all: 'Все статусы',
      added: 'Добавлен в аукцион',
      checkRequested: 'Требуется подтверждение',
      error: 'Ошибка обработки',
      empty: 'Данные не найдены',
      inProgress: 'Обрабатывается',
      rejected: 'Отклонен',
    }

  return (
    <Select
      value={filterValue}
      size="sm"
      onValueChange={(status: DonationPageProcessStatus) => {
        setFilterValue(status)

        onValueChange && onValueChange(status)
      }}
      {...selectProps}
    >
      <SelectTrigger className="text-gray-light">
        <Icons.Status size="xs" />
        <SelectValue placeholder="Фильтровать по статусу" />
      </SelectTrigger>
      <SelectContent sideOffset={4}>
        <SelectGroup>
          {donationProccessStatus.map(status => (
            <SelectItem key={status} value={status}>
              {donationProccessStatusItemText[status]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
