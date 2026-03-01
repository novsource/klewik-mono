import type { TabsProps } from '@radix-ui/react-tabs'

import type { WheelTabsStylesSlots } from '../../styles'

import { memo, useMemo, useState } from 'react'

import { auctionGamesSelectors } from '~entities/games/store'

import { StartTransitionContainer } from '~shared/components/start-transition-container'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Icons } from '~shared/ui/icons'
import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'

import { twSlotsStyles } from '~shared/utils'

import { TABS_CONTENT_NAMES } from '../../constants'
import { wheelTabsStyles } from '../../styles'
import { GameContorlTabContent } from './game-control-tab-content.ui'
import { GamePreferencesTabContent } from './game-preferences-tab-content.ui'
import { GameSlotsTabContent } from './game-slots-tab-content.ui'

const triggersNames = {
  control: 'Управление',
  slots: 'Слоты',
  preferences: 'Внешний вид',
} as const

type GameTabsProps = Omit<TabsProps, 'className'> & {
  slotsClassnames?: Partial<Record<WheelTabsStylesSlots, string>>
}

export const GameTabs = memo((props: GameTabsProps) => {
  const { slotsClassnames, ...tabsProps } = props

  const currentAuctionGame = useStoreSelector(auctionGamesSelectors.getGame)

  const [currentTab, setCurrentTab] = useState(TABS_CONTENT_NAMES.CONTROL)
  // const [isSlotsTabTransitionEnded, setIsSlotsTabTransitionEnded] = useState(false)

  // if (currentTab !== TABS_CONTENT_NAMES.SLOTS && isSlotsTabTransitionEnded) {
  //   setIsSlotsTabTransitionEnded(false)
  // }

  // useEffect(() => {
  //   if (currentTab === TABS_CONTENT_NAMES.SLOTS && !isSlotsTabTransitionEnded) {
  //     startTransition(() => setIsSlotsTabTransitionEnded(true))
  //   }
  // }, [isSlotsTabTransitionEnded, currentTab])

  const tabsStyles = useMemo(() => twSlotsStyles(wheelTabsStyles, slotsClassnames), [slotsClassnames])

  const tabsTriggers = useMemo(() => {
    return (
      Object.keys(triggersNames) as Array<keyof typeof triggersNames>
    ).map((item) => {
      const isCardsGamePreferencesTabTrigger = currentAuctionGame === 'cards' && item === 'preferences'

      return (
        <TabsTrigger
          key={triggersNames[item]}
          className={tabsStyles.tabTrigger}
          value={item.toLowerCase()}
          startContent={isCardsGamePreferencesTabTrigger && <Icons.Lock size="xs" />}
          disabled={isCardsGamePreferencesTabTrigger}
        >
          {triggersNames[item]}
        </TabsTrigger>
      )
    })
  }, [tabsStyles, currentAuctionGame])

  return (
    <Tabs
      className={tabsStyles.base}
      defaultValue={TABS_CONTENT_NAMES.CONTROL}
      onValueChange={setCurrentTab}
      {...tabsProps}
    >
      <TabsList className={tabsStyles.tabList}>
        {tabsTriggers}
      </TabsList>
      <GameContorlTabContent />
      <StartTransitionContainer fallback={<div>loading...</div>}>
        <GameSlotsTabContent />
      </StartTransitionContainer>
      <GamePreferencesTabContent />
    </Tabs>
  )
})
