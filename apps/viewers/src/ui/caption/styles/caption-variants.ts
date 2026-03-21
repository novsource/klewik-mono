import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const captionVariants = cva('flex flex-col gap-y-1 rounded-medium', {
	variants: {
		variant: {
			default: 'bg-dark text-gray-accent',
			info: 'bg-dark border-gray border-1 text-gray-accent',
			warn: 'bg-yellow/5 border-yellow/5 text-yellow border-1',
			docsInfo: 'bg-dark border-dark-light border-1 text-gray-accent',
		},
		size: {
			sm: 'px-4 pt-1.5 pb-2 text-md',
			default: 'px-4.5 pt-2.5 pb-3 text-md',
			lg: 'px-5 pt-3 pb-3.5 text-md',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
})

export const captionTitleVariants = cva('text-sm', {
	variants: {
		variant: {
			default: 'text-gray-light',
			info: 'text-gray-light',
			warn: 'text-yellow/50',
			docsInfo: 'text-gray-light',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export type CaptionStylesProps = VariantProps<typeof captionVariants>
