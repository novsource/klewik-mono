import { CvaClassValue } from '@/shared/utils/types'
import { VariantProps, cva } from 'class-variance-authority'

type SizesCvaVariants = {
  size: {
    default: CvaClassValue
    sm: CvaClassValue
    lg: CvaClassValue
  }
}

type LabelVariants = SizesCvaVariants

type ContentWrapperVariants = SizesCvaVariants

type InputVariants = SizesCvaVariants & {
  withLabel: {
    true: CvaClassValue
  }
  startContent: {
    true: CvaClassValue
  }
  endContent: {
    true: CvaClassValue
  }
}

export const labelVariants = cva<LabelVariants>('select-none text-white', {
  variants: {
    size: {
      default: 'text-md font-semibold',
      lg: 'text-md font-semibold',
      sm: 'text-sm font-medium',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export const contentVariants = cva<ContentWrapperVariants>(
  'flex w-full rounded-medium bg-dark transition-all ring-gray-light data-[focus=true]:ring-1 data-[hover=true]:ring-1',
  {
    variants: { size: { default: 'h-10', sm: 'h-9', lg: 'h-11' } },
    defaultVariants: {
      size: 'default',
    },
  }
)

export const contentWrapperVariants = cva<ContentWrapperVariants>(
  'flex w-full items-center',
  {
    variants: {
      size: {
        default: 'px-3 gap-x-2',
        sm: 'px-2 gap-x-1',
        lg: 'px-4 gap-x-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export const inputVariants = cva<InputVariants>(
  [
    'flex w-full items-center',
    'dark bg-dark',
    'text-body font-medium text-white',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-gray',
    'rounded-medium ring-offset-background',
    'placeholder:text-gray',
  ],
  {
    variants: {
      size: {
        default: 'h-10 text-md px-4 py-3',
        lg: 'h-11 px-5 py-4',
        sm: 'h-9 text-sm px-3 py-2',
      },
      withLabel: {
        true: 'focus-visible:ring-1 focus-visible:ring-gray-accent',
      },
      startContent: {
        true: 'px-0 focus-visible:ring-0 focus-visible:ring-offset-0',
      },
      endContent: {
        true: 'px-0 focus-visible:ring-0 focus-visible:ring-offset-0',
      },
    },
    defaultVariants: {
      size: 'default',
      startContent: false,
      endContent: false,
      withLabel: false,
    },
  }
)

export type InputVariantsProps = VariantProps<typeof inputVariants>
