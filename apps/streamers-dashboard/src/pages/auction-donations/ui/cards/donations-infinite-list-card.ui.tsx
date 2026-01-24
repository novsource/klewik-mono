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

import type { ButtonProps } from '~shared/ui/button'
import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { Icons } from '~shared/ui/icons'
import { MotionBox } from '~shared/ui/motion-box'

export type InfiniteDonationsListCardProps = BaseDonationCardProps & {
  donation: ProcessedDonation
  actionButtonProps?: ButtonProps
}

export const InfiniteDonationsListCard = (props: InfiniteDonationsListCardProps) => {
  const { donation, actionButtonProps, ...restProps } = props

  const isLargeThenTablet = useMediaQuery(greaterThenDeviceWidthMediaQueries.tablet)

  return (
    <BaseDonationCard className="pt-1.5 max-tablet:pr-2.5" {...restProps}>
      <Flex className="gap-x-4 tablet:gap-x-10" justify="between" align="end">
        <Flex className="w-full" direction="column">
          <BaseDonationCardHeader>
            <Flex className="w-full h-5" justify="between">
              <Flex className="gap-x-1">
                <IntegrationBadge integration={donation.source} />
                <DonationCardStatusBadge status={donation.processData.status} />
              </Flex>
            </Flex>
          </BaseDonationCardHeader>
          <SolidDonationCardContent donationData={donation} />
        </Flex>
        <Button
          className="bg-dark-light size-8 tablet:size-8.5 text-gray-light transition-colors hover:text-white"
          isIconOnly
          icon={<Icons.ArrowRight size={isLargeThenTablet ? 'default' : 'sm'} />}
          {...actionButtonProps}
        />
      </Flex>
    </BaseDonationCard>
  )
}

export const InfiniteDonationsListSkeletonCard = () => {
  return (
    <MotionBox
      initial={{ opacity: 0, scaleX: 0.95, scaleY: 0.98 }}
      animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      exit={{ opacity: 0, scaleX: 0.95, scaleY: 0.98, transition: { duration: 0.15 } }}
    >
      <SkeletonDonationCard />
    </MotionBox>
  )
}
