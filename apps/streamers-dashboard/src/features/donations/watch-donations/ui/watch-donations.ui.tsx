import { memo, useMemo } from 'react'

import { motion } from 'framer-motion'

import { Donation } from '~entities/donation/model'
import { donationsSelectors } from '~entities/donation/store'
import { DonationCard } from '~entities/donation/ui/card'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex, FlexProps } from '~shared/ui/flex'

import { cn } from '~shared/utils'

type DonationListProps = FlexProps & {
  data?: Donation[]
  disableAnimation?: boolean
}

const DonationsList = memo((props: DonationListProps) => {
  const { data, className, disableAnimation, ...restProps } = props

  const storeDonations = useStoreSelector(donationsSelectors.getAllDonations)

  const donations = useMemo(
    () => data ?? storeDonations,
    [data, storeDonations]
  )

  return (
    <Flex
      className={cn('gap-y-2', className)}
      component="ul"
      direction="column"
      {...restProps}
    >
      {donations.map((donation) => (
        <motion.li
          key={donation.id}
          initial={disableAnimation ? false : { opacity: 0 }}
          animate={{ opacity: 1, dur: disableAnimation ? 0 : 0.5 }}
          exit={{ opacity: 0 }}
        >
          <DonationCard {...donation} />
        </motion.li>
      ))}
    </Flex>
  )
})

export { DonationsList }
