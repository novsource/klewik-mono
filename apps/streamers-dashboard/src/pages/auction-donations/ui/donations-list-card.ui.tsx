import { ProcessDonationSheet } from '~widgets/process-donation-dialogs/ui'

import type { ProcessedDonation } from '~entities/donation/model'
import type { BaseDonationCardProps } from '~entities/donation/ui/card'
import {
  BaseDonationCard,
  BaseDonationCardHeader,
  DonationCardStatusBadge,
  SkeletonDonationCard,
  SolidDonationCardContent,
} from '~entities/donation/ui/card'

import { IntegrationBadge } from '~entities/integrations/ui/badge'

import { greaterThenDeviceWidthMediaQueries } from '~shared/constants/tailwindcss'

import { useMediaQuery } from '~shared/hooks'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { MotionBox } from '~shared/ui/motion-box'

export type InfiniteDonationsListCardProps = BaseDonationCardProps & {
  donation: ProcessedDonation
}

export const InfiniteDonationsListCard = (props: InfiniteDonationsListCardProps) => {
  const { donation, ...restProps } = props

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <BaseDonationCard {...restProps}>
      <Flex className="gap-x-4 tablet:gap-x-10" justify="between" align="end">
        <Flex className="w-full" direction="column">
          <BaseDonationCardHeader>
            <Flex className="w-full h-6" justify="between">
              <Flex className="gap-x-1.5">
                <IntegrationBadge integration={donation.source} />
                <DonationCardStatusBadge status={donation.processData.status} />
              </Flex>
            </Flex>
          </BaseDonationCardHeader>
          <SolidDonationCardContent donationData={donation} />
        </Flex>
        <ProcessDonationSheet
          donation={donation}
          trigger={(
            <Button
              className="bg-dark-light size-7 tablet:size-8.5 text-gray-light transition-colors hover:text-white"
              isIconOnly
              icon={<Icons.ArrowRight size={isLargeThenTablet ? 'default' : 'sm'} />}
            />
          )}
        />
      </Flex>
    </BaseDonationCard>
  )
}

export const InfiniteDonationsListSkeletonCard = () => {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.1,
        ease: 'easeInOut',
      }}
    >
      <SkeletonDonationCard />
    </MotionBox>
  )
}
