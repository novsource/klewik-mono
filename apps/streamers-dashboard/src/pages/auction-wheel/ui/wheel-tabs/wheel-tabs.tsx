import type { TabsProps } from '@radix-ui/react-tabs'

import { useMemo } from 'react'

import { TABS_CONTENT_NAMES } from '~pages/auction-wheel/constants'
import type { WheelTabsStylesSlots } from '~pages/auction-wheel/styles'
import { wheelTabsStyles } from '~pages/auction-wheel/styles'

import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'
import { twSlotsStyles } from '~shared/utils'

import { ControlWheelTab } from './wheel-tab-control'
import { SlotsWheelTab } from './wheel-tab-slots'

const triggersNames = {
  control: 'Управление',
  slots: 'Слоты',
} as const

type WheelTabsProps = Omit<TabsProps, 'className'> & {
  slotsClassnames?: Partial<Record<WheelTabsStylesSlots, string>>
}

const WheelTabs = (props: WheelTabsProps) => {
  const { slotsClassnames, ...tabsProps } = props

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
      {...tabsProps}
    >
      <TabsList className={tabsStyles.tabList}>
        {tabsTriggers}
      </TabsList>
      <ControlWheelTab />
      <SlotsWheelTab />
    </Tabs>
  )
}

export default WheelTabs
