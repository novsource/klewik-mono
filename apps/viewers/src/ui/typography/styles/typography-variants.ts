import type { VariantProps } from 'class-variance-authority'
import type { CvaClassValue } from '~lib/cva'

import type { TypographyTags } from '../ui/typography.ui'
import { cva } from 'class-variance-authority'

type TypographyVariants = {
	tag: {
		[Tag in TypographyTags]: CvaClassValue;
	}
}

export const typographyVariants = cva<TypographyVariants>('', {
	variants: {
		tag: {
			h1: 'text-title-xl tablet:text-[28px] font-bold',
			h2: 'text-title-lg tablet:text-title-xl font-bold',
			h3: 'text-title tablet:text-title-lg font-semibold',
			h4: 'text-md tablet:text-title font-semibold',
			span: 'text-md inline-block font-medium',
			p: 'text-md font-regular',
		},
	},
})

export type TypographyVariantsProps = VariantProps<typeof typographyVariants>
