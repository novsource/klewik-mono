import { cva } from 'class-variance-authority'

export const tabsListVariants = cva(
  'relative inline-flex h-10 items-center justify-center rounded-large p-1',
)

export const tabsTriggerVariants = cva([
  'z-10 inline-flex items-center justify-center whitespace-nowrap',
  'rounded-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  'px-3 py-1.5 max-tablet:px-2 max-tablet:py-1.25',
  'text-gray-light font-medium max-tablet:text-sm',
  'transition-all data-[state=active]:text-white data-[state=active]:shadow-sm',
])

export const tabsContentVariants = cva(
  'mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
)

export const tabsTriggerRunnerVariants = cva(
  'absolute h-8 rounded-medium bg-dark-accent transition-all tabs-runner-shadow border-1 border-gray/20',
)
