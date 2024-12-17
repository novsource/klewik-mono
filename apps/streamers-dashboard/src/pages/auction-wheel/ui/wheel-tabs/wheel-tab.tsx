import { useMemo } from 'react'

import { Icons } from '~shared/ui/icons'
import { Tabs, TabsList, TabsTrigger } from '~shared/ui/tabs'

import AppearanceWheelTab from './appearance-wheel-tab/appearance-wheel-tab'
import ControlWheelTab from './control-wheel-tab/control-wheel-tab'
import LotsWheelTab from './lots-wheel-tab/lots-wheel-tab'

const triggersWithIcons = {
  control: {
    title: 'Управление',
    icon: <Icons.Gamepad width={18} height={18} />,
  },
  lots: {
    title: 'Слоты',
    icon: <Icons.List width={18} height={18} />,
  },
  appearance: {
    title: 'Внешний вид',
    icon: <Icons.Palette width={18} height={18} />,
  },
}

const WheelTab = () => {
  const tabsTriggers = useMemo(() => {
    return (
      Object.keys(triggersWithIcons) as Array<keyof typeof triggersWithIcons>
    ).map((item) => (
      <TabsTrigger
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
      <LotsWheelTab />
      <AppearanceWheelTab />
    </Tabs>
  )
}

export default WheelTab
