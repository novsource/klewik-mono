import AnimatedTruncText from '@/pages/AuctionWheelPage/components/WheelTabs/LotsWheelTab/LotCard/AnimatedTruncText'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/Table/Table'

type SlotsTableProps = {}

const slotsTableColumnHeaders = {
  id: {
    name: 'ID',
    className: 'w-[100px]',
  },
  slotTitle: {
    name: 'Наименование слота',
    className: 'min-w-[100px] max-w-[500px]',
  },
  slotPoints: {
    name: 'Количество очков',
    className: 'min-w-[150px] w-[200px]',
  },
  chance: {
    name: 'Шанс победы',
    className: 'w-[150px]',
  },
}

const items: AuctionSlot[] = Array(20).fill({
  _id: '#123',
  name: Array(100).fill('Test').join(' '),
  points: 1000,
  chance: 10,
})

const SlotsTable = (props: SlotsTableProps) => {
  return (
    <Table>
      <TableCaption>Последнее обновление: 5 минут назад</TableCaption>
      <TableHeader>
        {(
          Object.keys(slotsTableColumnHeaders) as Array<
            keyof typeof slotsTableColumnHeaders
          >
        ).map((key) => {
          const { name, className } = slotsTableColumnHeaders[key]
          return <TableHead className={className}>{name}</TableHead>
        })}
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          return (
            <TableRow key={item._id}>
              {(Object.keys(item) as Array<keyof typeof item>).map((key) => (
                <TableCell className="max-w-[500px] overflow-clip" key={key}>
                  <AnimatedTruncText>{String(item[key])}</AnimatedTruncText>
                  {/* {typeof item[key] === 'number'
                    ? new Intl.NumberFormat('ru-ru').format(item[key])
                    : String(item[key])} */}
                </TableCell>
              ))}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default SlotsTable
