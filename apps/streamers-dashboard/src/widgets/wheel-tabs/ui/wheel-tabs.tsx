import { useMemo } from 'react'

import { Icons } from '~shared/ui/icons'
import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'

import { AppearanceWheelTab } from './wheel-tab-appereance'
import { ControlWheelTab } from './wheel-tab-control'
import { SlotsWheelTab } from './wheel-tab-slots'

const triggersWithIcons = {
  control: {
    title: 'Управление',
    icon: <Icons.Gamepad size="default" />,
  },
  lots: {
    title: 'Слоты',
    icon: <Icons.List size="default" />,
  },
  appearance: {
    title: 'Внешний вид',
    icon: <Icons.Palette size="default" />,
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
        className="flex flex-grow gap-x-2 text-md font-medium data-[state=active]:rounded-[8px]"
      >
        {triggersWithIcons[item].icon}
        {triggersWithIcons[item].title}
      </TabsTrigger>
    ))
  }, [])
  return (
    <Tabs defaultValue="control" className="flex h-full flex-col">
      <TabsList className="dark flex w-full justify-between rounded-large bg-dark">
        {tabsTriggers}
      </TabsList>
      <ControlWheelTab />
      <SlotsWheelTab slots={[]} />
      <AppearanceWheelTab />
    </Tabs>
  )
}

export default WheelTabs
