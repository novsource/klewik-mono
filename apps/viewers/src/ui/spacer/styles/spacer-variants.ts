import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const spacerVariants = cva('inline-block', {
	variants: {
		orientation: {
			horizontal: 'h-0.25 w-full',
			vertical: 'h-full w-0.25',
		},
	},
	defaultVariants: {
		orientation: 'horizontal',
	},
})

export type SpacerStylesProps = VariantProps<typeof spacerVariants>
