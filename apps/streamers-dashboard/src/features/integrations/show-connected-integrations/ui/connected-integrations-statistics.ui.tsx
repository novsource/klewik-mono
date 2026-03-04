import type { ReactNode } from 'react'
import { memo, useMemo } from 'react'

import type { IntegrationsPlatforms } from '~entities/integrations/model'
import { integrationsSelectors } from '~entities/integrations/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

type IntegrationsStatisticsCardProps = {
  children: ReactNode
}

const IntegrationsStatisticsCard = ({
  children,
}: IntegrationsStatisticsCardProps) => {
  return (
    <Card size="sm" className="rounded-medium">
      <CardHeader>
        <CardTitle className="text-sm text-gray-light">
          Подключенные интеграции
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1 text-gray-accent font-medium text-md font-golos-f">
        {children}
      </CardContent>
    </Card>
  )
}

const integrationsLogo: Record<IntegrationsPlatforms, ReactNode> = {
  donationAlerts: <Icons.DonationAlerts width={18} height={24} />,
  donatePay: <Icons.DonatePay />,
  twitch: <Icons.TwitchLogo />,
  userInput: <></>,
}

const ConnectedIntegrationsStatisticCard = memo(() => {
  const integrationsStatuses = useStoreSelector(
    integrationsSelectors.getAllIntegrationsStatuses,
  )

  const isAllIntegrationsNotConnected = useMemo(() => {
    return (
      (
        Object.keys(integrationsStatuses) as Array<IntegrationsPlatforms>
      ).reduce((acc, key) => {
        if (integrationsStatuses[key].isConnected)
          acc++

        return acc
      }, 0) === 0
    )
  }, [integrationsStatuses])

  const connectedIntegrationsLogos = useMemo(() => {
    return (
      <Flex className="gap-x-2" direction="row" justify="start" align="center">
        {(
          Object.keys(integrationsStatuses) as Array<IntegrationsPlatforms>
        ).reduce<ReactNode[]>((acc, key) => {
          if (integrationsStatuses[key].isConnected)
            acc.push(integrationsLogo[key])

          return acc
        }, [])}
      </Flex>
    )
  }, [integrationsStatuses])

  return (
    <IntegrationsStatisticsCard>
      {isAllIntegrationsNotConnected
        ? 'Не найдено'
        : connectedIntegrationsLogos}
    </IntegrationsStatisticsCard>
  )
})

export { ConnectedIntegrationsStatisticCard }
