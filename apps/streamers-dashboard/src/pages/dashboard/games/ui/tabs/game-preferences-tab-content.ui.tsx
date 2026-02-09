import type { PreferencesWheelTabSlots } from '../../styles'

import { useMemo } from 'react'

import { auctionGamesSelectors } from '~entities/games/store'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Divider } from '~shared/ui/divider'
import { TabsContent } from '~shared/ui/tabs'
import type { TabsContentProps } from '~shared/ui/tabs'

import { cn, twSlotsStyles } from '~shared/utils'

import { TABS_CONTENT_NAMES } from '../../constants'
import { preferencesWheelTabStyles } from '../../styles'
import { RecolorWheelSlotsSection, WheelSlicesResizerSection } from './wheel/preferences-tab-content.ui'

type SlotsWheelTabProps = Omit<TabsContentProps, 'value'> & {
  slotsClassnames?: Partial<Record<PreferencesWheelTabSlots, string>>
}

export const GamePreferencesTabContent = (props: SlotsWheelTabProps) => {
  const { slotsClassnames, ...tabsContentProps } = props

  const currentAuctionGame = useStoreSelector(auctionGamesSelectors.getGame)

  const tabsContentStyles = useMemo(() =>
    twSlotsStyles(preferencesWheelTabStyles, slotsClassnames), [slotsClassnames])

  return (
    <TabsContent
      className={cn(tabsContentStyles.content)}
      value={TABS_CONTENT_NAMES.PREFERENCES}
      {...tabsContentProps}
    >
      {currentAuctionGame === 'wheel' && (
        <>
          <WheelSlicesResizerSection />
          <Divider className="mt-2.5 mb-3 border-gray/20" />
          <RecolorWheelSlotsSection />
        </>
      )}
    </TabsContent>
  )
}
