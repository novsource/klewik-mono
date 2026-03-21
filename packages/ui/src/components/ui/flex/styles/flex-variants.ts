import { VariantProps, cva } from 'class-variance-authority'

const flexVariants = cva('flex', {
  variants: {
    direction: {
      row: 'flex-row',
      column: 'flex-col',
    },
    wrap: {
      nowrap: '',
      forward: 'flex-wrap',
      reverse: 'flex-wrap-reverse',
    },
    justify: {
      start: 'justify-start',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      center: 'justify-center',
      evenly: 'justify-evenly',
    },
    align: {
      stretch: 'items-stretch',
      start: 'items-start',
      end: 'items-end',
      center: 'items-center',
      baseline: 'items-baseline',
    },
  },
  defaultVariants: {
    direction: 'row',
    wrap: 'nowrap',
    justify: 'start',
    align: 'stretch',
  },
})

export type FlexVariantsProps = VariantProps<typeof flexVariants>
export { flexVariants }
