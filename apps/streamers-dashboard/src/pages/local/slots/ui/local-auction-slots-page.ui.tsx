import { DividedLayout } from '~shared/layouts/divided-layout'
import { PageDashboardLayout } from '~shared/layouts/page-dashboard-layout'

import { Icons } from 'klewik-ui/icons'
import { Input } from 'klewik-ui/input'
import { Stack } from 'klewik-ui/stack'

import { AddSlotPanel } from './flows/add-slot-panel.ui'
import { LocalAuctionSlotsList } from './lists/local-auction-slots-list.ui'
import { LocalDonationsList } from './lists/local-donations-list.ui'

export const LocalAuctionSlotsPage = () => {
  return (
    <PageDashboardLayout className="tablet:pt-0 desktop-lg:max-w-[2500px] desktop:max-w-[1750px]">
      <DividedLayout
        slotClassnames={{
          container: 'flex w-full h-full pt-8 pl-6 items-center',
          divider: 'h-1/5',
        }}
        gap={24}
      >
        <Stack className="w-full h-full px-2 basis-4/5" justify="flex-start" align="stretch">
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
        </Stack>

        <div className="flex w-full h-full basis-1/5">
          <LocalDonationsList />
        </div>

      </DividedLayout>
    </PageDashboardLayout>

  )
}
