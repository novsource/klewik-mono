import { ReactNode, memo, useMemo } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'

import { motion } from 'framer-motion'
import { Virtualizer as VirtualList } from 'virtua'

import { ProcessedDonation } from '~entities/donation/model'
import { donationsSelectors } from '~entities/donation/store'
import { DonationCard } from '~entities/donation/ui/card'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Flex } from '~shared/ui/flex'
import {
  ShadowScrollArea,
  ShadowScrollAreaProps,
} from '~shared/ui/shadow-scroll-area'

import { cn } from '~shared/utils'

type DonationListProps = ShadowScrollAreaProps & {
  data?: ProcessedDonation[]
  disableAnimation?: boolean
  renderDonation?: (donation: ProcessedDonation, index: number) => ReactNode
}

const DonationsList = memo((props: DonationListProps) => {
  const { data, className, disableAnimation, renderDonation, ...restProps } =
    props

  const storeDonations = useStoreSelector(donationsSelectors.getAllDonations)

  const donations = useMemo(
    () => data ?? storeDonations,
    [data, storeDonations]
  )

  return (
    <Flex className="w-full h-full">
      <AutoSizer>
        {({ width, height }) => {
          return (
            <ShadowScrollArea
              className={cn(className)}
              style={{
                width,
                height,
                overflowAnchor: 'none',
                overflowY: 'auto',
              }}
              {...restProps}
            >
              <VirtualList count={donations.length} overscan={5}>
                {donations.map((donation, index) =>
                  renderDonation ? (
                    renderDonation(donation, index)
                  ) : (
                    <motion.li
                      key={donation.id}
                      initial={disableAnimation ? false : { opacity: 0 }}
                      animate={{ opacity: 1, dur: disableAnimation ? 0 : 0.5 }}
                      exit={{ opacity: 0 }}
                    >
                      <DonationCard data={donation} />
                    </motion.li>
                  )
                )}
              </VirtualList>
            </ShadowScrollArea>
          )
        }}
      </AutoSizer>
    </Flex>
  )
})

export { DonationsList }
