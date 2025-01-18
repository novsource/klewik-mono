import { HTMLAttributes } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '~shared/ui/card'
import { Icons } from '~shared/ui/icons'

type TableCardInfoProps = HTMLAttributes<HTMLDivElement>

const TableCardInfo = (props: TableCardInfoProps) => {
  return (
    <div className="flex flex-nowrap gap-x-2 [&>section]:rounded-medium">
      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-nowrap text-sm text-gray-light">
            Подключенные платежные системы
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1">
          <Icons.DonationAlerts width={18} height={24} />
        </CardContent>
      </Card>
      <Card size="sm">
        <CardTitle className="py-0 text-nowrap text-sm text-gray-light">
          Количество слотов
        </CardTitle>

        <CardContent className="pt-1 font-semibold text-gray-accent">
          0
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle className="py-0 text-nowrap text-sm text-gray-light">
            Общая сумма очков слотов
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1 font-semibold text-gray-accent">
          0
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle className="py-0 text-nowrap text-sm text-gray-light">
            Свободные очки
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1 font-semibold text-gray-accent">
          0
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle className="py-0 text-nowrap text-sm text-gray-light">
            Очки стримера
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1 font-semibold text-gray-accent">
          0
        </CardContent>
      </Card>
    </div>
  )
}

export default TableCardInfo
