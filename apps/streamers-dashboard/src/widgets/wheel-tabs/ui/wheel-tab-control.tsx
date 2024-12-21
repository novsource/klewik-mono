import { SpinWheelButton } from '~features/wheel/spin-wheel/ui'

import { TabsContent } from '~shared/ui/tabs'

const ControlWheelTab = () => {
  return (
    <>
      <TabsContent
        value="control"
        className="mt-5 flex flex-col gap-y-3 data-[state=active]:h-full"
      >
        <SpinWheelButton />
      </TabsContent>
    </>
  )
}

export { ControlWheelTab }
