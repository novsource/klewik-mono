import type { HTMLAttributes, ReactNode, RefObject } from 'react'
import type { JSX } from 'react/jsx-runtime'

import type {
	TypographyVariantsProps,
} from '../styles/typography-variants'
import { useMemo } from 'react'

import { cn } from '~utils/cn'
import {
	typographyVariants,
} from '../styles/typography-variants'

export type TitleProps = HTMLAttributes<HTMLHeadingElement> & {
	ref?: RefObject<HTMLHeadingElement>
	level?: 1 | 2 | 3
}

export const Title = (props: TitleProps) => {
	const { level = 1, ...restProps } = props

	return <Typography tag={`h${level}`} {...restProps} />
}

export type TypographyTags = 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p'

type TypographyHTMLElements = Pick<HTMLElementTagNameMap, TypographyTags>

export type TypographyProps<T extends keyof TypographyHTMLElements> = {
	tag: T
	value?: string
	children?: ReactNode
} & Omit<TypographyVariantsProps, 'tag'>
& HTMLAttributes<TypographyHTMLElements[T]>

export function Typography<T extends keyof TypographyHTMLElements>({
	children,
	tag,
	className,
	value,
	...props
}: TypographyProps<T>) {
	const Comp = tag as keyof Pick<JSX.IntrinsicElements, TypographyTags>

	const styles = useMemo(
		() => cn(typographyVariants({ tag }), className),
		[className, tag],
	)

	return (
		<Comp className={styles} {...props}>
			{children ?? value}
		</Comp>
	)
}
