import { cva } from 'class-variance-authority'

const accordionTriggerVariants = cva([
  'flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none cursor-pointer no-underline',
  'hover:underline',
  'disabled:pointer-events-none disabled:opacity-50',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  '[&[data-state=open]>svg]:rotate-180',
])

const accordionContentVariants = cva([
  'overflow-hidden text-sm',
  'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
])

const accordionItemVariants = cva('border-b last:border-b-0')

export {
  accordionTriggerVariants,
  accordionContentVariants,
  accordionItemVariants,
}
