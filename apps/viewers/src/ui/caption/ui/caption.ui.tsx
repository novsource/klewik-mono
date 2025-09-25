import type { ComponentProps } from 'react'
import type { CaptionStylesProps } from '../styles/caption-variants'
import { useMemo } from 'react'
import { Typography } from '~ui/typography'
import { cn } from '~utils/cn'

import { captionVariants } from '../styles/caption-variants'

export type CaptionProps = ComponentProps<'div'> & CaptionStylesProps & {
	title?: string
}

export const Caption = (props: CaptionProps) => {
	const { title, className, variant, children, ...restProps } = props

	const styles = useMemo(() =>
		cn(captionVariants({ variant }), className), [variant, className])

	return (
		<div className={styles} {...restProps}>
			{title && <Typography tag="span">{title}</Typography>}
			{children}
		</div>
	)
}
