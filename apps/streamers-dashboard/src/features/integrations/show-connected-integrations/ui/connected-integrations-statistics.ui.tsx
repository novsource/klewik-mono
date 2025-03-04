import { ReactNode, memo, useMemo } from 'react'

import { IntegrationsPlatforms } from '~entities/integrations/model'
import { integrationsSelectors } from '~entities/integrations/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
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

const ConnectedIntegrationsStatisticCard = memo(() => {
  const integrationsStatuses = useStoreSelector(
    integrationsSelectors.getAllIntegrationsStatuses
  )

  const integrationsLogo: Record<IntegrationsPlatforms, ReactNode> = {
    'donation-alerts': <Icons.DonationAlerts width={18} height={24} />,
    'donate-pay': <Icons.DonatePay />,
  }

  const isAllIntegrationsNotConnected = useMemo(() => {
    return (
      (
        Object.keys(integrationsStatuses) as Array<IntegrationsPlatforms>
      ).reduce((acc, key) => {
        if (integrationsStatuses[key].isConnected) acc++

        return acc
      }, 0) === 0
    )
  }, [integrationsStatuses])

  const connectedIntegrationsLogos = useMemo(() => {
    return (
      <div className="flex flex-row gap-x-2 items-center justify-start">
        {(
          Object.keys(integrationsStatuses) as Array<IntegrationsPlatforms>
        ).reduce<ReactNode[]>((acc, key) => {
          if (integrationsStatuses[key].isConnected)
            acc.push(integrationsLogo[key])

          return acc
        }, [])}
      </div>
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
