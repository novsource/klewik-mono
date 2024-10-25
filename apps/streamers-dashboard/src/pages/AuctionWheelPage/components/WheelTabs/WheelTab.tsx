import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AppearanceWheelTab from './AppearanceWheelTab/AppearanceWheelTab'
import ControlWheelTab from './ControlWheelTab/ControlWheelTab'
import LotsWheelTab from './LotsWheelTab/LotsWheelTab'
import { useMemo } from 'react'
import { Icons } from '@ui/icons'

const triggersWithIcons = {
  Control: <Icons.Gamepad width={21} height={21} />,
  Lots: <Icons.List width={21} height={21} />,
  Appearance: <Icons.Tuning width={21} height={21} />,
}

const WheelTab = () => {
  const tabsTriggers = useMemo(() => {
    return (
      Object.keys(triggersWithIcons) as Array<keyof typeof triggersWithIcons>
    ).map((item) => (
      <TabsTrigger
        value={item.toLowerCase()}
        className="flex flex-grow gap-x-2 text-body font-semibold data-[state=active]:rounded-[8px] data-[state=active]:bg-dark-accent"
      >
        <>
          {triggersWithIcons[item]}
          {item}
        </>
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
