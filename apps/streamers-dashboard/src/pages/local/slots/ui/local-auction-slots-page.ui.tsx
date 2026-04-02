import { LocalAuctionSlotsList } from './lists/local-auction-slots-list.ui'

export const LocalAuctionSlotsPage = () => {
  return (
    <div className="w-full h-full tablet:min-h-[var(--height-page)] tablet:h-auto">
      <div className="flex w-full h-full pt-8 px-6 gap-x-6">
        <div className="flex w-full basis-4/5">
          <LocalAuctionSlotsList />
        </div>

        <div className="flex w-full basis-1/5">
          <LocalAuctionSlotsList />
        </div>
      </div>
    </div>
  )
}
