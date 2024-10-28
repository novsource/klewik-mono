import { TabsContent } from '@ui/Tabs/Tabs'
import { Icons } from '@ui/icons'

const ControlWheelTab = () => {
  return (
    <TabsContent
      value="control"
      className="mt-5 flex flex-col gap-y-3 data-[state=active]:h-full"
    >
      <div className="flex flex-col gap-y-2">
        <button
          onClick={console.log}
          className="flex w-fit items-center justify-center gap-x-2 rounded-[16px] bg-green px-5 py-3 text-title font-semibold text-white"
        >
          <Icons.Refresh width={21} height={21} />
          Spin wheel
        </button>
      </div>
    </TabsContent>
  )
}

export default ControlWheelTab
