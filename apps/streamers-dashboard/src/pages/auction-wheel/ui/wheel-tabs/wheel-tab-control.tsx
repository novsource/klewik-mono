import { SpinTimeInput } from '~features/wheel/set-spin-time/ui'
import { SpinWheelButton } from '~features/wheel/spin-wheel/ui'

import { Flex } from '~shared/ui/flex'
import { TabsContent } from '~shared/ui/tabs'

import { TABS_CONTENT_NAMES } from '../../constants'

const ControlWheelTab = () => {
  return (
    <TabsContent
      className="mt-5 flex flex-col gap-y-3 data-[state=active]:h-full"
      value={TABS_CONTENT_NAMES.CONTROL}
    >
      <Flex className="w-full gap-x-2">
        <SpinWheelButton className="w-full" />
        <SpinTimeInput />
      </Flex>
    </TabsContent>
  )
}

export { ControlWheelTab }
