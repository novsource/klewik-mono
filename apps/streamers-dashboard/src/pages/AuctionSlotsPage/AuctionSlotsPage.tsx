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

      <div className="flex flex-col gap-y-3">
        <div className="flex h-full w-full">
          <CardContainer size="sm" variant="slots">
            <div className="flex flex-nowrap gap-x-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-nowrap">
                    Подключенные платежные системы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Icons.DonationAlerts width={18} height={24} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-nowrap">
                    Количество слотов
                  </CardTitle>
                </CardHeader>
                <CardContent>0</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-nowrap">
                    Общая сумма очков слотов
                  </CardTitle>
                </CardHeader>
                <CardContent>0</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-nowrap">Свободные очки</CardTitle>
                </CardHeader>
                <CardContent>0</CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-nowrap">Очки стримера</CardTitle>
                </CardHeader>
                <CardContent>0</CardContent>
              </Card>
            </div>
          </CardContainer>
        </div>
      </div>
      <SlotsTable />
    </div>
  )
}

export default AuctionSlotsPage
