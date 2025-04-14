import { useState } from 'react'

import { Donation } from '~entities/donation/model'

import { Icons } from '~shared/ui/icons'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectProps,
  SelectTrigger,
  SelectValue,
} from '~shared/ui/select'
import { Typography } from '~shared/ui/typograghy'

type DonationProcessStatus = Donation['processingStatus'] | 'default'

const donationProccessStatus: Array<DonationProcessStatus> = [
  'default',
  'added',
  'confirm',
  'empty',
  'error',
]

type DonationsProcessStatusFilterProps = SelectProps & {
  status: DonationProcessStatus | undefined
}

const DonationsProcessStatusFilter = (
  props: DonationsProcessStatusFilterProps
) => {
  const { status, onValueChange, ...selectProps } = props
  const [filterValue, setFilterValue] = useState<DonationProcessStatus>(
    status ?? 'default'
  )

  const donationProccessStatusItemText: Record<DonationProcessStatus, string> =
    {
      default: 'Все статусы',
      added: 'Добавлен в аукцион',
      confirm: 'Требуется подтверждение',
      error: 'Ошибка обработки',
      empty: 'Данные не найдены',
    }

  return (
    <Select
      value={filterValue}
      onValueChange={(status: DonationProcessStatus) => {
        setFilterValue(status)

        onValueChange && onValueChange(status)
      }}
      {...selectProps}
    >
      <SelectTrigger className="min-w-[80px]">
        <Icons.Status />

        {filterValue === 'default' ? (
          ''
        ) : (
          <Typography className="font-semibold" tag="span">
            Статус:{' '}
          </Typography>
        )}
        <SelectValue placeholder="Статус" />
      </SelectTrigger>
      <SelectContent sideOffset={4}>
        <SelectGroup>
          {donationProccessStatus.map((status) => (
            <SelectItem key={status} value={status}>
              {donationProccessStatusItemText[status]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { DonationsProcessStatusFilter as DonationsFilterSelect }
