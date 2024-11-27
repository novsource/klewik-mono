import {
  Card,
  CardContainer,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ui/Card/Card'
import { Icons } from '@ui/icons'
import SearchInput from './components/SearchInput/SearchInput'
import { Button } from '@ui/index'
import SlotsTable from './components/SlotsTable/SlotsTable'
import TableCardInfo from './components/TableCardInfo/TableCardInfo'

type AuctionSlotsPageProps = {}

const AuctionSlotsPage = (props: AuctionSlotsPageProps) => {
  return (
    <div className="grid h-full w-full grid-rows-slots gap-y-7 py-4 pl-4">
      <div className="flex flex-nowrap items-center gap-x-4">
        <SearchInput />
        <div className="flex items-center gap-x-2">
          <Button
            variant={'default'}
            startContent={<Icons.Pencil width={16} height={16} />}
          >
            Редактировать
          </Button>
          <Button
            variant={'action'}
            startContent={<Icons.Plus width={16} height={16} />}
          >
            Добавить слот
          </Button>
        </div>
      </div>

      <div className="h-full w-full overflow-x-scroll">
        <TableCardInfo />
      </div>

      <SlotsTable />
    </div>
  )
}

export default AuctionSlotsPage
