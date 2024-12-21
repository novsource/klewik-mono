import * as React from 'react'

import { cn } from '~shared/utils'

import {
  tableBaseVariants,
  tableBaseWrapperVariants,
  tableBodyVariants,
  tableCaptionVariants,
  tableCellVariants,
  tableFooterVariants,
  tableHeadVariants,
  tableHeaderVariants,
  tableRowVariants,
} from '../styles/table-variants'

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => {
  const wrapperStyles = React.useMemo(() => cn(tableBaseWrapperVariants()), [])
  const baseStyles = React.useMemo(
    () => cn(tableBaseVariants(), className),
    [className]
  )

  return (
    <div className={wrapperStyles}>
      <table ref={ref} className={baseStyles} {...props} />
    </div>
  )
})
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const styles = React.useMemo(
    () => cn(tableHeaderVariants(), className),
    [className]
  )

  return <thead ref={ref} className={styles} {...props} />
})
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const styles = React.useMemo(
    () => cn(tableBodyVariants(), className),
    [className]
  )

  return <tbody ref={ref} className={styles} {...props} />
})
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  const styles = React.useMemo(
    () => cn(tableFooterVariants(), className),
    [className]
  )

  return <tfoot ref={ref} className={styles} {...props} />
})
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => {
  const styles = React.useMemo(
    () => cn(tableRowVariants(), className),
    [className]
  )

  return <tr ref={ref} className={styles} {...props} />
})
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const style = React.useMemo(
    () => cn(tableHeadVariants(), className),
    [className]
  )

  return <th ref={ref} className={style} {...props} />
})
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => {
  const styles = React.useMemo(
    () => cn(tableCellVariants(), className),
    [className]
  )

  return <td ref={ref} className={styles} {...props} />
})
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => {
  const styles = React.useMemo(
    () => cn(tableCaptionVariants(), className),
    [className]
  )

  return <caption ref={ref} className={styles} {...props} />
})
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
