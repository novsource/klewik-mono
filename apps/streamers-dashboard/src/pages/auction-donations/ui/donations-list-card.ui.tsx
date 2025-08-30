import { ProcessDonationSheet } from '~widgets/process-donation-dialogs/ui'

import type { ProcessedDonation } from '~entities/donation/model'
import type { BaseDonationCardProps } from '~entities/donation/ui/card'
import {
  BaseDonationCard,
  BaseDonationCardHeader,
  DonationCardStatusBadge,
  SolidDonationCardContent,
} from '~entities/donation/ui/card'

import { IntegrationBadge } from '~entities/integrations/ui/badge'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'

export type InfinitiDonationsListCardProps = BaseDonationCardProps & {
  donation: ProcessedDonation
}

export const InfinityDonationsListCard = (props: InfinitiDonationsListCardProps) => {
  const { donation, ...restProps } = props

  return (
    <BaseDonationCard {...restProps}>
      <BaseDonationCardHeader>
        <Flex className="w-full h-6" justify="between">
          <Flex className="gap-x-1.5">
            <IntegrationBadge integration={donation.source} />
            <DonationCardStatusBadge status={donation.processData.status} />
          </Flex>
          <Flex>
            <ProcessDonationSheet
              donation={donation}
              trigger={(
                <Button
                  className="h-full text-gray-accent hover:text-white/80 transition-colors z-50"
                  variant="ghost"
                  size="xs"
                  isIconOnly
                  icon={<Icons.OpenArrow size="xs" />}
                />
              )}
            />
          </Flex>
        </Flex>
      </BaseDonationCardHeader>
      <SolidDonationCardContent donationData={donation} />
    </BaseDonationCard>
  )
}
