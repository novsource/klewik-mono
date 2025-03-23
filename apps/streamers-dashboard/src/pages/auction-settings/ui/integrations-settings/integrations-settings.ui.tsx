import { DonatePayIntegrationCard } from '~features/integrations/connect-integration/ui/donate-pay'
import { DonationAlertsIntegrationCard } from '~features/integrations/connect-integration/ui/donation-alerts'

import { Flex } from '~shared/ui/flex'
import { TabsContent } from '~shared/ui/tabs'
import { Typography } from '~shared/ui/typograghy'

const AuctionIntegrationsSettingsContent = () => {
  return (
    <TabsContent className="w-full h-full" value="integrations">
      <Flex className="h-fit w-full gap-y-3" direction="column">
        <Typography tag="h3">Платформы для пожертвований</Typography>
        <Flex className="w-full gap-x-2" align="center">
          <DonationAlertsIntegrationCard />
          <DonatePayIntegrationCard />
        </Flex>
      </Flex>
    </TabsContent>
  )
}

export { AuctionIntegrationsSettingsContent as AuctionIntegrationsSettings }
