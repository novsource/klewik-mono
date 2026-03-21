import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

export const modalStyles = cva([
  'p-0 w-full h-full',
  'flex flex-col gap-y-0 justify-between',
  'border-dark-light rounded-[16px] bg-dark-foreground overflow-scroll',
], {
  variants: {
    variant: {
      default: [
        'max-w-[700px] max-h-3/5 min-h-[300px]',
        'landtop:min-w-[700px] landtop:w-1/2 landtop:max-w-[900px]',
        'desktop:min-w-[900px] desktop:w-1/2 desktop:max-w-[1100px]',
        'desktop-lg:min-w-[1100px] desktop-lg:w-1/2 desktop-lg:max-w-[1300px]',
      ],
      clear: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export type ModalStyleVariants = VariantProps<typeof modalStyles>
