import { Button } from '@ui/Button/button'
import { TabsContent } from '@ui/Tabs/Tabs'
import { Icons } from '@ui/icons'

const ControlWheelTab = () => {
  return (
    <TabsContent
      value="control"
      className="mt-5 flex flex-col gap-y-3 data-[state=active]:h-full"
    >
      <div className="flex flex-col gap-y-2">
        <Button
          className="flex w-fit items-center justify-center gap-x-1 rounded-medium bg-green px-4 py-2.5 text-body font-medium text-white"
          variant={'default'}
        >
          <Icons.Refresh width={18} height={18} />
          Spin wheel
        </Button>
      </div>
    </TabsContent>
  )
}

export default ControlWheelTab
