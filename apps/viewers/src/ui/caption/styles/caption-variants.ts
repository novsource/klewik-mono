import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const captionVariants = cva('p-4 rounded-medium border-1', {
	variants: {
		variant: {
			info: 'bg-dark border-gray',
			warn: 'bg-yellow/5 border-yellow/20 text-yellow',
		},
	},
	defaultVariants: {
		variant: 'info',
	},
})

export type CaptionStylesProps = VariantProps<typeof captionVariants>
