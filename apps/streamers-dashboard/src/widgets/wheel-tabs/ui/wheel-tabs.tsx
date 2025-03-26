import { useMemo } from 'react'

import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'

import { ControlWheelTab } from './wheel-tab-control'
import { SlotsWheelTab } from './wheel-tab-slots'

const triggersWithIcons = {
  control: {
    title: 'Управление',
  },
  lots: {
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
        className="flex grow gap-x-2 text-md font-medium data-[state=active]:rounded-[8px] cursor-pointer text-gray-light/70 hover:text-gray-light"
      >
        {triggersWithIcons[item].title}
      </TabsTrigger>
    ))
  }, [])
  return (
    <Tabs defaultValue="control" className="flex h-full flex-col">
      <TabsList className="dark flex w-full justify-between rounded-large bg-dark ">
        {tabsTriggers}
      </TabsList>
      <ControlWheelTab />
      <SlotsWheelTab />
    </Tabs>
  )
}

export default WheelTabs
