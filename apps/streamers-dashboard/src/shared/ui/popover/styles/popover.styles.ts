import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

const popoverVariants = cva([
  'z-50 w-72 rounded-md border-dark-accent border-1 p-4 shadow-md outline-hidden bg-dark text-white',
  'transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0',
])

type PopoverVariantsProps = VariantProps<typeof popoverVariants>

export type { PopoverVariantsProps }
export { popoverVariants }
