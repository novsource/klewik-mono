import { tailwindScreens } from '~shared/constants/tailwindcss'
import { useMediaQuery } from '~shared/hooks/use-media-query'
import { Button } from '~shared/ui/button'
import { Icons } from '~shared/ui/icons'

import SearchInput from './search-input/search-input'
import SlotsTable from './slots-table/slots-table'
import TableCardInfo from './table-card-info/table-card-info'
import { TableItemCard } from './table-item-card/table-item-card'

type AuctionSlotsPageProps = {}

const items: AuctionSlot[] = Array(20).fill({
  _id: '123',
  name: Array(100).fill('Test').join(' '),
  points: 1000,
  chance: 10,
})

const AuctionSlotsPage = (props: AuctionSlotsPageProps) => {
  const isMediaLargeThenTablet = useMediaQuery(
    `(min-width: ${tailwindScreens.tablet})`
  )
  return (
    <div className="mb-4 grid h-full w-full grid-rows-slotsTable gap-y-3 mobile:gap-y-5 tablet:grid-rows-slotsDesktop tablet:gap-y-7 tablet:pb-4 tablet:pl-2">
      <div className="flex flex-nowrap items-center gap-x-4 pt-1">
        <SearchInput size={!isMediaLargeThenTablet ? 'lg' : 'default'} />
        <div className="flex items-center gap-x-2">
          <Button
            size={!isMediaLargeThenTablet ? 'lg' : 'default'}
            variant={'default'}
            startContent={<Icons.Pencil size="sm" />}
          >
            {isMediaLargeThenTablet && 'Редактировать'}
          </Button>
          <Button
            size={!isMediaLargeThenTablet ? 'lg' : 'default'}
            variant={'action'}
            startContent={<Icons.Plus size="sm" />}
          >
            {isMediaLargeThenTablet && 'Добавить слот'}
          </Button>
        </div>
      </div>

      {isMediaLargeThenTablet && (
        <div className="w-full overflow-x-scroll">
          <TableCardInfo />
        </div>
      )}

      {isMediaLargeThenTablet ? (
        <SlotsTable />
      ) : (
        <div className="h-full w-full overflow-scroll">
          <ul className="flex h-full w-full flex-col gap-y-2">
            {items.map((item) => (
              <TableItemCard data={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AuctionSlotsPage
