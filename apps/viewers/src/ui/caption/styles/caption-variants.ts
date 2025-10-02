import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const captionVariants = cva('rounded-medium border-1 p-4', {
	variants: {
		variant: {
			info: 'bg-dark border-gray',
			warn: 'bg-yellow/5 border-yellow/5 text-yellow',
		},
	},
	defaultVariants: {
		variant: 'info',
	},
})

export type CaptionStylesProps = VariantProps<typeof captionVariants>
