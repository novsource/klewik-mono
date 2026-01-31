import type { TabsProps } from '@radix-ui/react-tabs'

import { startTransition, useEffect, useMemo, useState } from 'react'

import { TABS_CONTENT_NAMES } from '~pages/auction-wheel/constants'
import type { WheelTabsStylesSlots } from '~pages/auction-wheel/styles'
import { wheelTabsStyles } from '~pages/auction-wheel/styles'

import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'

import { twSlotsStyles } from '~shared/utils'

import { ControlWheelTabContent } from './wheel-tab-control'
import { PreferencesWheelTabContent } from './wheel-tab-preferences.ui'
import { SlotsWheelTabContent } from './wheel-tab-slots'

const triggersNames = {
  control: 'Управление',
  slots: 'Слоты',
  preferences: 'Внешний вид',
} as const

type WheelTabsProps = Omit<TabsProps, 'className'> & {
  slotsClassnames?: Partial<Record<WheelTabsStylesSlots, string>>
}

const WheelTabs = (props: WheelTabsProps) => {
  const { slotsClassnames, ...tabsProps } = props

  const [currentTab, setCurrentTab] = useState(TABS_CONTENT_NAMES.CONTROL)
  const [isSlotsTabTransitionEnded, setIsSlotsTabTransitionEnded] = useState(false)

  if (currentTab !== TABS_CONTENT_NAMES.SLOTS && isSlotsTabTransitionEnded) {
    setIsSlotsTabTransitionEnded(false)
  }

  useEffect(() => {
    if (currentTab === TABS_CONTENT_NAMES.SLOTS && !isSlotsTabTransitionEnded) {
      startTransition(() => setIsSlotsTabTransitionEnded(true))
    }
  }, [isSlotsTabTransitionEnded, currentTab])

  const tabsStyles = useMemo(() => twSlotsStyles(wheelTabsStyles, slotsClassnames), [slotsClassnames])

  const tabsTriggers = useMemo(() => {
    return (
      Object.keys(triggersNames) as Array<keyof typeof triggersNames>
    ).map(item => (
      <TabsTrigger
        key={triggersNames[item]}
        className={tabsStyles.tabTrigger}
        value={item.toLowerCase()}
      >
        {triggersNames[item]}
      </TabsTrigger>
    ))
  }, [tabsStyles])

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
      <ControlWheelTabContent />
      {isSlotsTabTransitionEnded && <SlotsWheelTabContent />}
      <PreferencesWheelTabContent />
    </Tabs>
  )
}

export default WheelTabs
