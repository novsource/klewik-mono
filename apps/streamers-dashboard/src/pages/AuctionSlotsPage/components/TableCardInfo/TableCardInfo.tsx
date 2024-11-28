import {
  Card,
  CardContainer,
  CardContent,
  CardHeader,
  CardTitle,
} from '@ui/Card/Card'
import { Icons } from '@ui/icons'
import { HTMLAttributes } from 'react'

type TableCardInfoProps = HTMLAttributes<HTMLDivElement>

const TableCardInfo = (props: TableCardInfoProps) => {
  return (
    <CardContainer size="sm" variant="slots">
      <div className="flex flex-nowrap gap-x-2 [&>section]:rounded-medium">
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
            <CardTitle className="text-nowrap">Количество слотов</CardTitle>
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
  )
}

export default TableCardInfo
