import { toast } from 'sonner'
import { ZodError } from 'zod'

import { wheelActions } from '~entities/wheel/store'

import { useStoreDispatch, useStoreSelector } from '~shared/lib/redux-toolkit'
import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'
import { TabsContent } from '~shared/ui/tabs'
import { Toaster } from '~shared/ui/toaster'

const ControlWheelTab = () => {
  const dispatch = useStoreDispatch()
  const wheelEventBus = useStoreSelector((state) => state.wheel.emitter)

  const handleClick = () => {
    try {
      wheelEventBus.notify('spin', null)
      dispatch(
        wheelActions.addSlots({
          id: 1,
          color: '#FF',
          name: 'test',
          endAngle: 4,
          startAngle: 5,
          points: 1000,
        })
      )
    } catch (err) {
      if (err instanceof ZodError) {
        toast(err.message)
      } else if (err instanceof Error) {
        toast(err.message)
      }
    }
  }

  return (
    <>
      <TabsContent
        value="control"
        className="mt-5 flex flex-col gap-y-3 data-[state=active]:h-full"
      >
        <Button
          variant={'action'}
          startContent={<Icons.Refresh size="default" />}
          onClick={handleClick}
        >
          Прокрутить
        </Button>
      </TabsContent>
      <Toaster />
    </>
  )
}

export { ControlWheelTab }
