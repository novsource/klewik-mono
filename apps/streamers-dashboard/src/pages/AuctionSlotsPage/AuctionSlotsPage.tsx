import { Icons } from '@ui/icons'
import SearchInput from './components/SearchInput/SearchInput'
import { Button } from '@ui/index'
import SlotsTable from './components/SlotsTable/SlotsTable'
import TableCardInfo from './components/TableCardInfo/TableCardInfo'
import { useMediaQuery } from '@hooks/useMediaQuery'
import { tailwindScreens } from '@/lib/constants/twScreens'
import { TableItemCard } from './components/TableItemCard/TableItemCard'

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
    <div className="table:grid-rows-slotsDesktop mb-4 grid h-full w-full grid-rows-slotsTable gap-y-3 pt-2 mobile:gap-y-5 tablet:gap-y-7 tablet:py-4 tablet:pl-4">
      <div className="flex flex-nowrap items-center gap-x-4">
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
        <div className="h-full w-full overflow-x-scroll">
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
