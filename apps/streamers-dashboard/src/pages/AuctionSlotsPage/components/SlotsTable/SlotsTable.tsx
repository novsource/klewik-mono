import AnimatedTruncText from '@/pages/AuctionWheelPage/components/WheelTabs/LotsWheelTab/LotCard/AnimatedTruncText'
import { Typography } from '@ui/index'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/Table/Table'
import { useCallback, useMemo, useState } from 'react'

type SlotsTableProps = {}

const items: AuctionSlot[] = Array(20).fill({
  _id: '123',
  name: Array(100).fill('Test').join(' '),
  points: 1000,
  chance: 10,
})

type TableColumn<T> = {
  key: keyof T
  label: string
}

type TableColumnKeys<T> = Array<
  T extends { readonly [index: number]: { key: infer K } } ? K : never
>

type TypedUseCallback<T extends Function> = ReturnType<typeof useCallback<T>>

type RenderCellFn<
  T = unknown,
  K extends Array<TableColumn<T>> = Array<TableColumn<T>>,
> = TypedUseCallback<
  (columnKey: TableColumnKeys<K>[number], dataItem: T) => JSX.Element
>

type RenderRowFn<
  T = unknown,
  K extends Array<TableColumn<T>> = Array<TableColumn<T>>,
> = TypedUseCallback<
  (
    dataItem: T,
    columnsKeys: TableColumnKeys<K>,
    renderCellFn: RenderCellFn<T, K>
  ) => JSX.Element
>

type RenderColumnsFn<
  T = unknown,
  K extends Array<TableColumn<T>> = Array<TableColumn<T>>,
> = TypedUseCallback<(columns: K) => JSX.Element[]>

const tableColumns: TableColumn<
  Omit<AuctionSlot, 'sponsorsIds' | 'slotHSVColor'>
>[] = [
  {
    key: '_id',
    label: 'ID',
  },
  {
    key: 'name',
    label: 'Наименование слота',
  },
  {
    key: 'points',
    label: 'Количество очков',
  },
  {
    key: 'chance',
    label: 'Шанс',
  },
] as const

const SlotsTable = (props: SlotsTableProps) => {
  const [initTableData, setInitTableData] = useState<AuctionSlot[]>(() => [])

  const columnsKeys = useMemo(
    () => tableColumns.map((column) => column.key),
    []
  )

  const renderRowFn: RenderRowFn<AuctionSlot, typeof tableColumns> =
    useCallback(
      (item, columnsKeys, renderCellFn) => (
        <TableRow className="overflow-clip">
          {columnsKeys.map((columnKey) => renderCellFn(columnKey, item))}
        </TableRow>
      ),
      []
    )

  const renderCellFn: RenderCellFn<AuctionSlot, typeof tableColumns> =
    useCallback((columnKey, dataItem) => {
      switch (columnKey) {
        case '_id': {
          return (
            <TableCell
              className="w-[50px] min-w-[40px]"
              key={String(dataItem[columnKey])}
            >
              {`#${dataItem[columnKey]}`}
            </TableCell>
          )
        }
        case 'name': {
          return (
            <TableCell
              className="min-w-[250px] max-w-[500px]"
              key={String(dataItem[columnKey])}
            >
              <AnimatedTruncText>{dataItem[columnKey]}</AnimatedTruncText>
            </TableCell>
          )
        }
        case 'points': {
          return (
            <TableCell
              className="min-w-[100px] max-w-[250px]"
              key={String(dataItem[columnKey])}
            >
              {new Intl.NumberFormat('ru-ru').format(dataItem[columnKey])}
            </TableCell>
          )
        }
        case 'chance': {
          return (
            <TableCell
              className="w-[80px] max-w-[120px]"
              key={String(dataItem[columnKey])}
            >
              {dataItem[columnKey]
                ? new Intl.NumberFormat('ru-ru').format(dataItem[columnKey])
                : 0}
            </TableCell>
          )
        }
      }
    }, [])

  const renderColumnsFn: RenderColumnsFn<AuctionSlot, typeof tableColumns> =
    useCallback(
      (columns) =>
        columns.map((column) => {
          const { key, label } = column

          switch (key) {
            case '_id': {
              return (
                <TableHead className="min-w-[50px] max-w-[80px]" key={key}>
                  {label}
                </TableHead>
              )
            }
            case 'name': {
              return (
                <TableHead className="min-w-[150px]" key={key}>
                  {label}
                </TableHead>
              )
            }
            case 'points': {
              return (
                <TableHead
                  className="min-[100px] w-[150px] max-w-[200px]"
                  key={key}
                >
                  {label}
                </TableHead>
              )
            }
            case 'chance': {
              return (
                <TableHead className="w-[40px]" key={key}>
                  {label}
                </TableHead>
              )
            }
          }
        }),
      []
    )

  const emptyContent = useMemo(() => {
    return (
      initTableData.length === 0 && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Typography tag="span" className="text-gray-light">
            На данный момент в аукционе нет слотов
          </Typography>
        </div>
      )
    )
  }, [initTableData])

  return (
    <Table className="h-full">
      <TableHeader>{renderColumnsFn(tableColumns)}</TableHeader>
      <TableBody>
        {initTableData.map((item) =>
          renderRowFn(item, columnsKeys, renderCellFn)
        )}
        {emptyContent}
      </TableBody>
    </Table>
  )
}

export default SlotsTable
