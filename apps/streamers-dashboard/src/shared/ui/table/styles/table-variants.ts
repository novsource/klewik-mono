import { cva } from 'class-variance-authority'

export const tableBaseWrapperVariants = cva('relative w-full overflow-auto')

export const tableBaseVariants = cva(
  'w-full caption-bottom text-md text-[#F0F8FF]'
)

export const tableHeaderVariants = cva('sticky [&_tr]:border-b')

export const tableHeadVariants = cva(
  'text-nowrap px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 last:pl-3 last:pr-4 font-golosF'
)

export const tableBodyVariants = cva('[&_tr:last-child]:border-0')

export const tableFooterVariants = cva(
  'border-t font-medium last:[&>tr]:border-b-0'
)

export const tableRowVariants = cva('', {
  variants: {
    withBorder: {
      true: '[&>td]:border-b-1 [&>td]:border-gray/40 last:[&>td]:border-b-0',
      false:
        // '[&>td]:before:transition-all hover:[&>td]:before:ring-1 hover:[&>td]:before:ring-gray hover:[&>td]:before:bg-dark/30 cursor-pointer',
        'hover:[&>td]:before:border-t-1 hover:[&>td]:before:border-b-1 [&>td]:before:border-gray-light hover:[&>td]:before:bg-dark/30 cursor-pointer',
    },
  },
  defaultVariants: {
    withBorder: false,
  },
})

export const tableCellVariants = cva(
  [
    'py-4 px-4 align-middle [&:has([role=checkbox])]:pr-0 relative w-full',
    'text-nowrap font-golosF overflow-clip text-',
  ],
  {
    variants: {
      withBorder: {
        true: '',
        false: [
          'first:before:ml-0 last:before:-ml-1',
          'py-[22px]',
          'before:top-1/2 before:-translate-y-1/2 before:left-0 before:bg-dark before:-z-10 before:w-full before:transition-colors before:py-[28px]',
          'first:before:rounded-l-medium last:before:rounded-r-medium before:absolute',
        ],
      },
    },
    defaultVariants: {
      withBorder: false,
    },
  }
)

export const tableCaptionVariants = cva('mt-4 text-sm text-muted-foreground')
