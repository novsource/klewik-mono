import { DonatePayIntegrationCard } from '~features/integrations/connect-integration/ui/donate-pay'
import { DonationAlertsIntegrationCard } from '~features/integrations/connect-integration/ui/donation-alerts'

import { Typography } from '~shared/ui/typograghy'

const AuctionSettingsPage = () => {
  return (
    <div className="mb-4 flex gap-y-3 mobile:gap-y-5 tablet:max-w-[1100px] landtop:max-w-[1300px] tablet:gap-y-7 tablet:pb-4 tablet:px-2 desktop:max-w-[1800px] desktop-lg:max-w-[2100px] mx-auto w-full h-full">
      <div className="flex flex-col h-full w-full gap-y-10">
        <div className="flex flex-col gap-y-3 w-full h-fit">
          <Typography tag="h2">Интеграции</Typography>
          <div className="flex w-full items-center gap-x-2">
            <DonationAlertsIntegrationCard />
            <DonatePayIntegrationCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export { AuctionSettingsPage }
