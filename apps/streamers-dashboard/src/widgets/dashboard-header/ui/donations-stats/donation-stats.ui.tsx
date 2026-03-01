import type { ReactNode } from 'react'
import { memo } from 'react'

import NumberFlow from '@number-flow/react'

import { donationsSelectors } from '~entities/donation/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

const StatisticCard = ({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <Flex
      className={cn(
        'gap-x-1.5 py-1.5 px-2.5 h-full bg-dark rounded-md text-md font-semibold leading-5 text-gray-accent',
        className,
      )}
      align="center"
      justify="center"
    >
      {children}
    </Flex>
  )
}

export type DonationsStatsCardProps = {
  className?: string
}

export const DonationsStats = memo((props: DonationsStatsCardProps) => {
  const { className } = props

  const statusesCount = useStoreSelector(donationsSelectors.getDonationsStatusesCounts)

  return (
    <StatisticCard className={className}>
      <Flex className="w-full h-full gap-x-2.5" align="center">
        <Flex className="gap-x-1" align="center">
          <Icons.Hourglass width="16" height="16" />
          <NumberFlow
            className="font-azeret-mono font-medium tracking-tight"
            value={statusesCount.checkRequested}
          />
        </Flex>
      </Flex>
    </StatisticCard>
  )
})
