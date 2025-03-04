import { ComponentProps, ReactNode, memo } from 'react'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'

type SlotsStatisticsCardProps = {
  title: string | number
  children: ReactNode
}

const SlotsStatisticsCard = memo(
  ({ title, children }: SlotsStatisticsCardProps) => {
    return (
      <Card size="sm" className="rounded-medium">
        <CardHeader>
          <CardTitle className="text-sm text-gray-light">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-1 text-gray-accent font-medium font-golos-f">
          {children}
        </CardContent>
      </Card>
    )
  }
)

type SlotsStatisticsProps = ComponentProps<'div'>

const SlotsStatistics = memo((props: SlotsStatisticsProps) => {
  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)
  const storedSlotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum
  )

  return (
    <div
      className="flex flex-nowrap gap-x-2 [&>section]:rounded-medium"
      {...props}
    >
      <SlotsStatisticsCard title={'Подключенные интеграции'}>
        <Icons.DonationAlerts width={18} height={24} />
      </SlotsStatisticsCard>
      <SlotsStatisticsCard title={'Количество слотов'}>
        {storedSlots.length}
      </SlotsStatisticsCard>
      <SlotsStatisticsCard title={'Общая сумма очков слотов'}>
        {new Intl.NumberFormat('ru-RU').format(storedSlotsPointsSum)}
      </SlotsStatisticsCard>
      {/* <SlotsStatisticsCard title={'Свободные очки'}>0</SlotsStatisticsCard> */}
      {/* <SlotsStatisticsCard title={'Очки стримера'}>0</SlotsStatisticsCard> */}
    </div>
  )
})

export { SlotsStatistics }
