import type { VariantProps } from 'class-variance-authority'

import type { CvaClassValue } from '~lib/cva'
import { cva } from 'class-variance-authority'

type ButtonVariant
	= | 'default'
		| 'action'
		| 'outline'
		| 'error'
		| 'ghost-outline'
		| 'ghost'
		| 'link'

type ButtonSize = 'sm' | 'default' | 'lg' | 'xs'

type ButtonVariants = {
	variant: {
		[Variant in ButtonVariant]: CvaClassValue
	}
	size: {
		[Size in ButtonSize]: CvaClassValue
	}
	isIconOnly: {
		[Bool in 'true' | 'false']: CvaClassValue
	}
	startContent: {
		[Bool in 'true' | 'false']: CvaClassValue
	}
	endContent: {
		[Bool in 'true' | 'false']: CvaClassValue
	}
}

export const buttonVariants = cva<ButtonVariants>(
	[
		'inline-flex items-center justify-center gap-2',
		'ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden',
		'disabled:pointer-events-none disabled:opacity-50',
		'[&_svg]:pointer-events-none [&_svg]:shrink-0',
		'cursor-pointer rounded-small whitespace-nowrap transition-all select-none',
	],
	{
		variants: {
			variant: {
				'default':
          'border-1 border-gray/20 bg-dark text-gray-accent hover:border-gray/40 hover:bg-dark-accent/40 hover:text-white',
				'action':
          'bg-[#242A28] text-green-accent/80 hover:bg-[#2C3B33] hover:text-green-accent',
				'error': 'border-1 border-red/20 bg-red/10 text-red hover:bg-red/15 hover:border-red/30',
				'outline':
          'border-1 border-dark-accent bg-dark text-gray-accent hover:border-gray hover:bg-dark/80 hover:text-white/80',
				'ghost': 'border-transparent bg-transparent',
				'ghost-outline':
          'border-1 border-dark-accent/70 bg-transparent hover:border-gray',
				'link': 'text-primary underline-offset-4 hover:underline',
			},
			isIconOnly: {
				true: '',
				false: '',
			},
			size: {
				default:
          'h-10 rounded-md px-2.5 py-1 text-md leading-6 font-medium data-[icon-only=false]:[&_svg]:size-4.5',
				sm: 'h-9 rounded-md px-2 text-sm leading-6 font-medium data-[icon-only=false]:[&_svg]:size-4',
				xs: 'font-regular h-8.5 rounded-md px-1.5 text-sm leading-5 data-[icon-only=false]:[&_svg]:size-3.5',
				lg: 'h-10.5 rounded-md px-3 font-medium data-[icon-only=false]:[&_svg]:size-5',
			},
			startContent: {
				true: 'flex items-center justify-center gap-x-1',
				false: '',
			},
			endContent: {
				true: 'flex items-center justify-center gap-x-1',
				false: '',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			isIconOnly: false,
		},
		compoundVariants: [
			{ isIconOnly: true, size: 'default', className: 'size-10' },
			{ isIconOnly: true, size: 'sm', className: 'size-9 px-2 py-2' },
		],
	},
)

export type ButtonVariantsProps = VariantProps<typeof buttonVariants>
