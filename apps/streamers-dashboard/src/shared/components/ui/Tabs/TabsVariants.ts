import { cva } from 'class-variance-authority'

export const tabsListVariants = cva(
  'relative inline-flex h-10 items-center justify-center rounded-medium bg-muted p-1 text-muted-foreground'
)

export const tabsTriggerVariants = cva([
  'z-10 inline-flex items-center justify-center whitespace-nowrap',
  'rounded-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  'px-3 py-1.5',
  'text-body font-medium',
  'transition-all data-[state=active]:text-foreground data-[state=active]:shadow-sm',
])

export const tabsContentVariants = cva(
  'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
)
