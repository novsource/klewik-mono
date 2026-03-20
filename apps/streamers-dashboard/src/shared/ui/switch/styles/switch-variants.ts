import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { CvaClassValue } from '~shared/lib/cva'

type SwitchSize = 'sm' | 'default' | 'lg'

type SwitchStyleVariants = {
  size: {
    [Size in SwitchSize]: CvaClassValue
  }
}

export const switchVariants = cva<SwitchStyleVariants>([
  'relative flex rounded-full bg-dark-accent',
  'bg-no-repeat p-px shadow-[inset_0_1.5px_2px] shadow-gray-200 outline outline-1 -outline-offset-1 outline-gray-200 before:absolute before:rounded-full',
  'transition-[background-position,box-shadow] duration-[125ms] ease-[cubic-bezier(0.26,0.75,0.38,0.45)]',
  'active:bg-dark-light data-[checked]:bg-green data-[checked]:active:bg-green from-gray-500 shadow-black/75 outline-white/15 data-[checked]:shadow-none data-[checked]:data[disabled]:bg-green/60',
], {
  variants: {
    size: {
      default: 'h-5 w-9',
      sm: 'h-4 w-8',
      lg: 'h-6 w-10',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export const switchThumbVariants = cva([
  'aspect-square h-full rounded-full bg-white shadow-[0_0_1px_1px,0_1px_1px,1px_2px_4px_-1px] shadow-gray-100 dark:shadow-black/25',
  'transition-transform duration-150 data-[checked]:translate-x-4 data-[disabled]:bg-gray-light',
])

export type SwitchVariantsProps = VariantProps<typeof switchVariants>
