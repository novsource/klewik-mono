import { DividedLayout } from '~shared/layouts/divided-layout'
import { PageDashboardLayout } from '~shared/layouts/page-dashboard-layout'

import { Stack } from 'klewik-ui/stack'

import { LocalAuctionSlotsPageContextProvider } from '../context/local-auction-slots-page.context'
import { AddSlotPanel } from './flows/add-slot-panel.ui'
import { LocalSearchSlotsInput } from './inputs/search-slots-input.ui'
import { LocalAuctionSlotsList } from './lists/local-auction-slots-list.ui'
import { LocalDonationsList } from './lists/local-donations-list.ui'

export const LocalAuctionSlotsPage = () => {
  return (
    <LocalAuctionSlotsPageContextProvider>
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
              <LocalSearchSlotsInput />

              <AddSlotPanel />
            </DividedLayout>

            <LocalAuctionSlotsList />
          </Stack>

          <div className="flex w-full h-full basis-1/5">
            <LocalDonationsList />
          </div>

        </DividedLayout>
      </PageDashboardLayout>
    </LocalAuctionSlotsPageContextProvider>
  )
}
