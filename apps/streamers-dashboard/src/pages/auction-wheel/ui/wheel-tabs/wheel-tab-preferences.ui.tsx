import { useMemo } from 'react'

import { TABS_CONTENT_NAMES } from '~pages/auction-wheel/constants'
import { preferencesWheelTabStyles } from '~pages/auction-wheel/styles'
import type { PreferencesWheelTabSlots } from '~pages/auction-wheel/styles'

import { auctionSlotsActions, auctionSlotsSelectors } from '~entities/auction-slot/store'

import { useActionCreators, useStoreSelector } from '~shared/lib/redux-toolkit'

import { Button } from '~shared/ui/button'
import { Flex } from '~shared/ui/flex'
import { TabsContent } from '~shared/ui/tabs'
import type { TabsContentProps } from '~shared/ui/tabs'
import { Typography } from '~shared/ui/typograghy'

import { cn, getHEXColor, twSlotsStyles } from '~shared/utils'

type SlotsWheelTabProps = Omit<TabsContentProps, 'value'> & {
  slotsClassnames?: Partial<Record<PreferencesWheelTabSlots, string>>
}

export const PreferencesWheelTabContent = (props: SlotsWheelTabProps) => {
  const { slotsClassnames, ...tabsContentProps } = props

  const tabsContentStyles = useMemo(() =>
    twSlotsStyles(preferencesWheelTabStyles, slotsClassnames), [slotsClassnames])

  return (
    <TabsContent
      className={cn(tabsContentStyles.content)}
      value={TABS_CONTENT_NAMES.PREFERENCES}
      {...tabsContentProps}
    >
      <RecolorWheelSlotsButton />
    </TabsContent>
  )
}

function RecolorWheelSlotsButton() {
  const storedSlots = useStoreSelector(auctionSlotsSelectors.getSlots)

  const { updateSlot } = useActionCreators(auctionSlotsActions)

  const changeSlotsColors = () => {
    storedSlots.forEach((slot) => {
      const randomHexColor = getHEXColor()
      updateSlot({ id: slot.id, data: { color: randomHexColor } })
    })
  }

  return (
    <Flex direction="column">
      <Typography className="text-white/80 font-medium font-golos-f mb-2.5" tag="h3">Цветовая палитра</Typography>
      <Button onClick={changeSlotsColors}>Изменить цвета слотов</Button>
    </Flex>
  )
}
