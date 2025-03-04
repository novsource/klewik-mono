import { ReactNode, memo } from 'react'

import { auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'

type SlotsStatisticsCardProps = {
  title: string | number
  children: ReactNode
}

const SlotsStatisticsCard = ({ title, children }: SlotsStatisticsCardProps) => {
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

const SlotsCountStatisticCard = memo(() => {
  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  return (
    <SlotsStatisticsCard title="Количество слотов">
      {storedSlots.length}
    </SlotsStatisticsCard>
  )
})

const SlotsPointsSumStatisticCard = memo(() => {
  const storedSlotsPointsSum = useStoreSelector(
    auctionSlotsSelectors.getSlotsPointsSum
  )

  return (
    <SlotsStatisticsCard title={'Общая сумма очков слотов'}>
      {new Intl.NumberFormat('ru-RU').format(storedSlotsPointsSum)}
    </SlotsStatisticsCard>
  )
})

export { SlotsPointsSumStatisticCard, SlotsCountStatisticCard }
