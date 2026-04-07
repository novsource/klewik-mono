import { DividedLayout } from '~shared/layouts/divided-layout'

import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'

import { AddSlotPanel } from './flows/add-slot-panel.ui'
import { LocalAuctionSlotsList } from './lists/local-auction-slots-list.ui'
import { LocalDonationsList } from './lists/local-donations-list.ui'

export const LocalAuctionSlotsPage = () => {
  return (
    <div className="w-full h-full tablet:min-h-[var(--height-page)] tablet:h-auto">
      <DividedLayout
        slotClassnames={{
          container: 'flex w-full h-full pt-8 pl-6 items-center',
          divider: 'h-1/5',
        }}
        gap={24}
      >
        <div className="flex flex-col w-full h-full gap-y-4 px-2 basis-3/4">
          <DividedLayout
            slotClassnames={{
              container: 'w-full flex gap-x-2 items-center',
            }}
            gap={8}
          >
            <Input
              slotClassNames={{ base: 'min-w-[280px]', input: 'text-title overflow-ellipsis text-nowrap overflow-hidden' }}
              placeholder="Поиск по названию..."
              startContent={<Icons.Magnifier className="text-gray-light" />}
              size="lg"
            />
            <AddSlotPanel />
          </DividedLayout>

          <LocalAuctionSlotsList />
        </div>

        <div className="flex w-full h-full basis-1/4">
          <LocalDonationsList />
        </div>

      </DividedLayout>
    </div>
  )
}
