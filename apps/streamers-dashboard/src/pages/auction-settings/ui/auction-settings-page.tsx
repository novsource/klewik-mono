import { DonatePayIntegrationCard } from '~features/integrations/connect-integration/ui/donate-pay'
import { DonationAlertsIntegrationCard } from '~features/integrations/connect-integration/ui/donation-alerts'

import { Flex } from '~shared/ui/flex'
import { Typography } from '~shared/ui/typograghy'

const AuctionSettingsPage = () => {
  return (
    <Flex className="mb-4 gap-y-3 mobile:gap-y-5 tablet:max-w-[1100px] landtop:max-w-[1300px] tablet:gap-y-7 tablet:pb-4 tablet:px-2 desktop:max-w-[1800px] desktop-lg:max-w-[2100px] mx-auto w-full h-full">
      <Flex className="w-full h-full gap-y-10" direction="column">
        <Flex className="h-fit w-full gap-y-3" direction="column">
          <Typography tag="h2">Интеграции</Typography>
          <Flex className="w-full gap-x-2" align="center">
            <DonationAlertsIntegrationCard />
            <DonatePayIntegrationCard />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export { AuctionSettingsPage }
