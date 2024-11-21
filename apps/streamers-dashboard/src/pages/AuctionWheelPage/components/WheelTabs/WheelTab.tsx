import AppearanceWheelTab from './AppearanceWheelTab/AppearanceWheelTab'
import ControlWheelTab from './ControlWheelTab/ControlWheelTab'
import LotsWheelTab from './LotsWheelTab/LotsWheelTab'
import { useMemo } from 'react'
import { Icons } from '@ui/icons'
import { Tabs, TabsList, TabsTrigger } from '@ui/Tabs/Tabs'

const triggersWithIcons = {
  Control: <Icons.Gamepad width={18} height={18} />,
  Lots: <Icons.List width={18} height={18} />,
  Appearance: <Icons.Palette width={18} height={18} />,
}

const WheelTab = () => {
  const tabsTriggers = useMemo(() => {
    return (
      Object.keys(triggersWithIcons) as Array<keyof typeof triggersWithIcons>
    ).map((item) => (
      <TabsTrigger
        value={item.toLowerCase()}
        className="flex flex-grow gap-x-2 text-body font-medium data-[state=active]:rounded-[8px] data-[state=active]:bg-dark-accent"
      >
        {triggersWithIcons[item]}
        {item}
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
