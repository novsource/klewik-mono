import { useMemo } from 'react'

import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'

import { TABS_CONTENT_NAMES } from '../constants'
import { ControlWheelTab } from './wheel-tab-control'
import { SlotsWheelTab } from './wheel-tab-slots'

const triggersWithIcons = {
  control: {
    title: 'Управление',
  },
  slots: {
    title: 'Слоты',
  },
}

const WheelTabs = () => {
  const tabsTriggers = useMemo(() => {
    return (
      Object.keys(triggersWithIcons) as Array<keyof typeof triggersWithIcons>
    ).map((item) => (
      <TabsTrigger
        key={triggersWithIcons[item].title}
        value={item.toLowerCase()}
        className="flex grow cursor-pointer gap-x-2 text-md font-medium text-gray-light/70 hover:text-gray-light data-[state=active]:rounded-[8px]"
      >
        {triggersWithIcons[item].title}
      </TabsTrigger>
    ))
  }, [])
  return (
    <Tabs
      className="flex h-full flex-col"
      defaultValue={TABS_CONTENT_NAMES.CONTROL}
    >
      <TabsList className="dark flex w-full justify-between rounded-large bg-dark">
        {tabsTriggers}
      </TabsList>
      <ControlWheelTab />
      <SlotsWheelTab />
    </Tabs>
  )
}

export default WheelTabs
