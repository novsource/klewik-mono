import type { ButtonVariantsProps } from '../styles/button-variants'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '~utils/cn'
import { buttonVariants } from '../styles/button-variants'

export type ButtonProps = {
	asChild?: boolean
	startContent?: React.ReactNode
	endContent?: React.ReactNode
} & React.ComponentProps<'button'> & Omit<ButtonVariantsProps, 'startContent' | 'endContent'>

const Button = (
	{ ref, className, isIconOnly, variant, size, asChild = false, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> },
) => {
	const { children, startContent, endContent, ...otherProps } = props

	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			className={cn(
				buttonVariants({
					variant,
					size,
					isIconOnly,
					startContent: !!startContent,
					endContent: !!endContent,
				}),
				className,
			)}
			ref={ref}
			{...otherProps}
		>
			{startContent}
			{!isIconOnly && children}
			{endContent}
		</Comp>
	)
}
Button.displayName = 'Button'

export { Button, buttonVariants }
