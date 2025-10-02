import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

import type { FlexVariantsProps } from '../styles/flex-variants'
import { useMemo } from 'react'

import { cn } from '~utils/cn'
import { flexVariants } from '../styles/flex-variants'

export type FlexProps<T extends ElementType = 'div'>
	= ComponentPropsWithoutRef<T> & FlexVariantsProps & {
		as?: T
		children?: ReactNode
	}

export const Flex = <T extends ElementType = 'div'> (props: FlexProps<T>) => {
	const {
		as,
		ref,
		className,
		justify,
		wrap,
		direction,
		align,
		children,
		...restProps
	} = props

	const Comp = (as || 'div') as ElementType

	const styles = useMemo(
		() => cn(flexVariants({ justify, wrap, direction, align }), className),
		[className, justify, wrap, direction, align],
	)

	return (
		<Comp ref={ref} className={styles} {...restProps}>
			{children}
		</Comp>
	)
}
