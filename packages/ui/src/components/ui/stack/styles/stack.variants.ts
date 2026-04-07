import { cva, VariantProps } from "class-variance-authority";

export const stackVariants = cva('flex flex-col', {
  variants: {
    justify: {
      'center': 'justify-center',
      'flex-start': 'justify-start',
      'flex-end': 'justify-end',
      'space-between': 'justify-between',
      'space-around': 'justify-around'
    },
    align: {
      'center': 'items-center',
      'flex-start': 'items-start',
      'flex-end': 'items-end',
      'stretch': 'items-stretch',
    },
    gap: {
      'xs': 'gap-1',
      'sm': 'gap-2',
      'md': 'gap-4',
      'lg': 'gap-6',
      "xl": 'gap-8'
    }
  },
  defaultVariants: {
    justify: 'center',
    align: 'center',
    gap: 'md'
  }
})

export type StackVariantsProps = VariantProps<typeof stackVariants>
