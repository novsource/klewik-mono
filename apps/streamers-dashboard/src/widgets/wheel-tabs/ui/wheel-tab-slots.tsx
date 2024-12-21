import { AuctionSlot } from '~entities/auction-slot/model'

import { AnimatedTruncText } from '~shared/ui/animated-trunc-text'
import { TabsContent } from '~shared/ui/tabs'

const slots = [
  {
    id: 1,
    points: 1000,
    color: '#FFF',
    name: 'Hello',
  },
  {
    id: 2,
    points: 1000,
    color: '#FFF',
    name: 'Hello',
  },
] as AuctionSlot[]

const SlotCard = (props: AuctionSlot) => {
  const { color } = props

  return (
    <div className="flex h-10 w-full items-center justify-between gap-x-2 rounded-small bg-dark px-3 py-2">
      <div
        style={{ backgroundColor: `${color}` }}
        className="h-3 w-3 rounded-pill"
      />
      <AnimatedTruncText classNames="text-[15px] font-medium">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab deleniti
        repellat, commodi aliquid,
      </AnimatedTruncText>
    </div>
  )
}

type SlotsWheelTabProps = {
  slots: AuctionSlot[]
}

const SlotsWheelTab = ({ slots }: SlotsWheelTabProps) => {
  return (
    <TabsContent value="lots" className="data-[state=active]:h-full">
      <div className="flex h-full flex-col gap-y-2">
        {slots.map((item) => (
          <SlotCard key={item.name} {...item} />
        ))}
      </div>
    </TabsContent>
  )
}

export { SlotsWheelTab }
