import type { ReactNode } from 'react'
import { memo } from 'react'

import NumberFlow from '@number-flow/react'

import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

import { cn } from '~shared/utils'

const DonationsStats = memo((props: { className?: string }) => {
  return (
    <StatisticCard className={props.className}>
      <Flex className="w-full h-full gap-x-2.5" align="center">
        <Flex className="gap-x-1" align="center">
          <Icons.Success size="sm" />
          <NumberFlow
            className="font-azeret-mono font-medium tracking-tight"
            value={121}
          />
        </Flex>
        <Flex className="gap-x-1" align="center">
          <Icons.Warning width="16" height="16" />
          <NumberFlow
            className="font-azeret-mono font-medium tracking-tight"
            value={10}
          />
        </Flex>
        <Flex className="gap-x-0.5" align="center">
          <Icons.LargeCross size="sm" />
          <NumberFlow
            className="font-azeret-mono font-medium tracking-tight"
            value={0}
          />
        </Flex>
      </Flex>
    </StatisticCard>
  )
})

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
        'gap-x-1.5 py-1.5 px-2.5 h-9 bg-dark rounded-md text-md font-semibold leading-5 text-gray-accent',
        className,
      )}
      align="center"
      justify="center"
    >
      {children}
    </Flex>
  )
}

export { DonationsStats }
