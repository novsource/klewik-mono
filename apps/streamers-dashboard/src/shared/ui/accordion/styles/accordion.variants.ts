import { cva } from 'class-variance-authority'

export const accordionVariants = cva([
  'group flex w-96 max-w-[calc(100vw-8rem)] flex-col justify-center text-gray-light',
],
)

export const accordionTriggerVariants = cva([
  'group relative flex w-full items-baseline justify-between gap-4 bg-dark py-2 pr-1 pl-3 text-left font-medium cursor-pointer hover:underline',
  'hover:bg-dark-light/70 active:bg-dark-light/90 focus-visible:z-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple/60',
])

export const accordionItemVariants = cva([
  'rounded-sm overflow-clip',
  'group-data-[multiple=true]:first:rounded-t-sm group-data-[multiple=true]:rounded-none group-data-[multiple=true]:last:rounded-b-sm',
  'border-b-dark-accent group-data-[multiple=true]:border-b-1 group-data-[multiple=true]:last:border-b-0',
])

export const accordionPanelVariants = cva([
  'h-[var(--accordion-panel-height)] overflow-hidden text-md text-gray-accent bg-dark-foreground-light',
  'transition-[height] ease-out data-[ending-style]:h-0 data-[starting-style]:h-0',
])
