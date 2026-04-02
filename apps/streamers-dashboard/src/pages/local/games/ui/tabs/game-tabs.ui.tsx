import type { WheelTabsStylesSlots } from '../../styles'

import { memo, useMemo } from 'react'

import { auctionGamesSelectors } from '~entities/games/store'

import { StartTransitionContainer } from '~shared/components/start-transition-container'

import { useStoreSelector } from '~shared/lib/redux-toolkit'

import { Icons } from 'klewik-ui/icons'
import type { TabsProps } from 'klewik-ui/tabs'
import { Tabs, TabsList, TabsTrigger } from 'klewik-ui/tabs'

import { twSlotsStyles } from '~shared/utils'

import { TABS_CONTENT_NAMES } from '../../constants/tabs-content-names'
import { wheelTabsStyles } from '../../styles'
import { GameControlTabContent } from './game-control-tab-content.ui'
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

  const tabsClasses = useMemo(() => twSlotsStyles(wheelTabsStyles, slotsClassnames), [slotsClassnames])

  const tabsTriggers = useMemo(() => {
    return (
      Object.keys(triggersNames) as Array<keyof typeof triggersNames>
    ).map((item) => {
      const isCardsGamePreferencesTabTrigger = currentAuctionGame === 'cards' && item === 'preferences'

      return (
        <TabsTrigger
          key={triggersNames[item]}
          className={tabsClasses.tabTrigger}
          value={item.toLowerCase()}
          startContent={isCardsGamePreferencesTabTrigger && <Icons.Lock size="xs" />}
          disabled={isCardsGamePreferencesTabTrigger}
        >
          {triggersNames[item]}
        </TabsTrigger>
      )
    })
  }, [tabsClasses, currentAuctionGame])

  return (
    <Tabs
      className={tabsClasses.base}
      defaultValue={TABS_CONTENT_NAMES.CONTROL}
      {...tabsProps}
    >
      <TabsList className={tabsClasses.tabList}>
        {tabsTriggers}
      </TabsList>
      <GameControlTabContent />
      <StartTransitionContainer fallback={<div>loading...</div>}>
        <GameSlotsTabContent />
      </StartTransitionContainer>
      <GamePreferencesTabContent />
    </Tabs>
  )
})
