import { CvaClassValue } from '@/shared/utils/types'
import { VariantProps, cva } from 'class-variance-authority'

type ErrorCvaVariants = {
  isError: {
    [Bool in 'true' | 'false']: CvaClassValue
  }
}

type SizesCvaVariants = {
  size: {
    default: CvaClassValue
    sm: CvaClassValue
    lg: CvaClassValue
  }
}

type LabelVariants = SizesCvaVariants & ErrorCvaVariants
type DescriptionVariants = SizesCvaVariants & ErrorCvaVariants

type ContentBaseVariants = SizesCvaVariants & ErrorCvaVariants
type ContentWrapperVariants = SizesCvaVariants

type InputVariants = SizesCvaVariants &
  ErrorCvaVariants & {
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

export const labelVariants = cva<LabelVariants>('select-none', {
  variants: {
    size: {
      default: 'text-md font-semibold',
      lg: 'text-md font-semibold',
      sm: 'text-sm font-medium',
    },
    isError: {
      true: 'text-red',
      false: 'text-white',
    },
  },
  defaultVariants: {
    size: 'default',
    isError: false,
  },
})

export const descriptionVariants = cva<DescriptionVariants>(
  'text-gray-accent font-medium',
  {
    variants: {
      size: {
        default: 'text-sm',
        lg: 'text-sm',
        sm: 'text-sm',
      },
      isError: {
        true: 'text-red',
        false: 'text-white',
      },
    },
    defaultVariants: {
      size: 'default',
      isError: false,
    },
  }
)

export const contentVariants = cva<ContentBaseVariants>(
  'flex w-full rounded-medium bg-dark transition-all ring-gray-light data-[focus=true]:ring-1 data-[hover=true]:ring-1',
  {
    variants: {
      size: { default: 'h-10', sm: 'h-9', lg: 'h-11' },
      isError: { true: 'ring-red', false: 'ring-gray-light' },
    },
    defaultVariants: {
      size: 'default',
      isError: false,
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
    'flex w-full items-center px-2',
    'dark bg-dark',
    'font-medium text-white',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1',
    'rounded-medium ring-offset-background',
    'placeholder:text-gray',
  ],
  {
    variants: {
      size: {
        default: 'h-10 text-md px-4 py-3',
        lg: 'h-11 text-md px-4 py-4',
        sm: 'h-9 text-sm px-3 py-2',
      },
      isError: {
        true: 'focus-visible:ring-red',
        false: 'focus-visible:ring-gray',
      },
      withLabel: {
        true: '',
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
      isError: false,
      startContent: false,
      endContent: false,
      withLabel: false,
    },
  }
)

export type InputVariantsProps = VariantProps<typeof inputVariants>
