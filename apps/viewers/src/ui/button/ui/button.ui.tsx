import type { ButtonVariantsProps } from '../styles/button-variants'

import { Slot } from '@radix-ui/react-slot'

import { useMemo } from 'react'
import { cn } from '~utils/cn'
import { buttonVariants } from '../styles/button-variants'

export type ButtonProps = {
	asChild?: boolean
	startContent?: React.ReactNode
	endContent?: React.ReactNode
	icon?: React.ReactNode
} & React.ComponentProps<'button'> & Omit<ButtonVariantsProps, 'startContent' | 'endContent'>
& { ref?: React.RefObject<HTMLButtonElement | null> }

export const Button = (props: ButtonProps) => {
	const {
		ref,
		className,
		isIconOnly,
		variant,
		size,
		icon,
		asChild = false,
		children,
		startContent,
		endContent,
		...restProps
	} = props

	const Comp = asChild ? Slot : 'button'

	const style = useMemo(
		() =>
			cn(
				buttonVariants({
					variant,
					size,
					isIconOnly,
					startContent: !!startContent,
					endContent: !!endContent,
				}),
				className,
			),
		[isIconOnly, variant, size, startContent, endContent, className],
	)

	return (
		<Comp
			className={style}
			ref={ref}
			data-icon-only={isIconOnly}
			{...restProps}
		>
			{startContent}
			{!isIconOnly && children}
			{isIconOnly && icon}
			{endContent}
		</Comp>
	)
}
Button.displayName = 'Button'
