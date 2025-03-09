import { VariantProps, cva } from 'class-variance-authority'

const scrollAreaRootVariants = cva('relative')

const scrollAreaViewportVariants = cva(
  'ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1'
)

const scrollAreaScrollbarVariants = cva(
  'flex touch-none p-px transition-colors select-none',
  {
    variants: {
      orientation: {
        vertical: 'h-full w-2.5 border-l border-l-transparent',
        horizontal: 'h-2.5 flex-col border-t border-t-transparent',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
)

const scrollAreaThumbVariants = cva('bg-border relative flex-1 rounded-full')

export type ScrollAreaScrollbarVariantsProps = VariantProps<
  typeof scrollAreaScrollbarVariants
>

export {
  scrollAreaRootVariants,
  scrollAreaViewportVariants,
  scrollAreaScrollbarVariants,
  scrollAreaThumbVariants,
}
