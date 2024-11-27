import { cva } from 'class-variance-authority'

export const tableBaseWrapperVariants = cva('relative w-full overflow-auto')

export const tableBaseVariants = cva('w-full caption-bottom text-md text-white')

export const tableHeaderVariants = cva('sticky [&_tr]:border-b')

export const tableHeadVariants = cva(
  'text-nowrap h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0'
)

export const tableBodyVariants = cva('[&_tr:last-child]:border-0 px-4')

export const tableFooterVariants = cva(
  'border-t font-medium [&>tr]:last:border-b-0'
)

export const tableRowVariants = cva(
  'transition-colors data-[state=selected]:bg-muted [&>td]:hover:before:bg-dark-accent'
)

export const tableCellVariants = cva([
  'p-4 align-middle [&:has([role=checkbox])]:pr-0 relative',
  'text-nowrap overlow-hidden',
  'first:before:rounded-l-medium last:before:rounded-r-medium before:absolute',
  'before:top-1/2 before:-translate-y-1/2 before:left-0 before:bg-dark before:-z-10 before:w-full data-[hovered=true]:before:bg-dark-accent before:transition-colors',
  'before:py-[22px]',
])

export const tableCaptionVariants = cva('mt-4 text-sm text-muted-foreground')
