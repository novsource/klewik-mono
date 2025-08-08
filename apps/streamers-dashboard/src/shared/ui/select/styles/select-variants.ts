import type { VariantProps } from 'class-variance-authority'

import { cva } from 'class-variance-authority'

import type { CvaClassValue } from '~shared/utils/types'

export type SelectSizes = {
  variant: {
    default: CvaClassValue
    ghost: CvaClassValue
  }
  size: {
    sm: CvaClassValue
    default: CvaClassValue
  }
}

export type SelectPositions = {
  position: {
    'item-aligned': CvaClassValue
    'popper': CvaClassValue
  }
}

type SelectTriggerSizes = SelectSizes

const selectTriggerVariants = cva<SelectTriggerSizes>(
  [
    'flex w-fit items-center justify-between rounded-small border whitespace-nowrap transition-[color] outline-none',
    'hover:ring-gray/55 hover:bg-dark-accent/50 cursor-pointer',
    'border-dark-accent/70 data-[placeholder]:text-gray [&_svg:not([class*=\'text-\'])]:text-muted-foreground',
    'focus-visible:border-ring focus-visible:ring-gray-accent/80 aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
    'focus-visible:ring-[1px] disabled:cursor-not-allowed disabled:opacity-50',
    '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:text-gray-light *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        default: 'bg-dark',
        ghost: 'bg-transparent',
      },
      size: {
        default:
          'h-10 px-3 py-2 text-md gap-2 [&_svg:not([class*=\'size-\'])]:size-4.5',
        sm: 'h-9 text-sm px-2 py-1 gap-1 [&_svg:not([class*=\'size-\'])]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type SelectContentVariants = SelectPositions

const selectContentVariants = cva<SelectContentVariants>(
  [
    'bg-dark relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin)',
    'text-gray overflow-x-hidden overflow-y-auto rounded-md border border-dark-accent shadow-md',
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      position: {
        'item-aligned': '',
        'popper':
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
      },
    },
  },
)

type SelectViewportVariants = SelectPositions

const selectViewportVariants = cva<SelectViewportVariants>('p-1 bg-dark ', {
  variants: {
    position: {
      'item-aligned': '',
      'popper':
        'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
    },
  },
})

const selectLabelVariants = cva('text-muted-foreground px-2 py-1.5 text-xs')

type SelectItemVariants = SelectSizes

const selectItemVariants = cva<SelectItemVariants>(
  [
    'focus:bg-dark-accent focus:text-gray-accent [&_svg:not([class*=\'text-\'])]:text-gray-accent',
    'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none',
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2 cursor-pointer',
  ],
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-md',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)
const selectSeparatorVariants = cva(
  'bg-border pointer-events-none -mx-1 my-1 h-px',
)
const selectScrollUpButtonVariants = cva(
  'flex cursor-default items-center justify-center py-1',
)

const selectScrollDownButtonVariants = cva(
  'flex cursor-default items-center justify-center py-1',
)

export {
  selectContentVariants,
  selectItemVariants,
  selectLabelVariants,
  selectScrollDownButtonVariants,
  selectScrollUpButtonVariants,
  selectSeparatorVariants,
  selectTriggerVariants,
  selectViewportVariants,
}

type SelectContentVariantsProps = VariantProps<typeof selectContentVariants>

export type { SelectContentVariantsProps }
