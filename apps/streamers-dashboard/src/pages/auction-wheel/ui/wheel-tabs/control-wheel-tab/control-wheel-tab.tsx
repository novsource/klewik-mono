import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { TabsContent } from '~shared/ui/tabs'

const ControlWheelTab = () => {
  return (
    <TabsContent
      value="control"
      className="mt-5 flex flex-col gap-y-3 data-[state=active]:h-full"
    >
      <div className="">
        <Button
          variant={'action'}
          startContent={<Icons.Refresh width={18} height={18} />}
        >
          Прокрутить
        </Button>
      </div>
    </TabsContent>
  )
}

export default ControlWheelTab
