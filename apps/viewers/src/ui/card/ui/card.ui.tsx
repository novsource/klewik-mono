import type { CardContextProps } from '../context/card-context'

import type {
	CardStyleProps,
} from '../styles/card-variants'
import * as React from 'react'
import { cn } from '~utils/cn'
import {
	cardBaseVariants,
	cardContentVariants,
	cardDescriptionVariants,
	cardFooterVariants,
	cardHeaderVariants,
	cardTitleVariants,
} from '../styles/card-variants'

export type CardProps = React.ComponentProps<'div'> & CardStyleProps & { ref?: React.RefObject<HTMLDivElement | null> }

const Card = ({ ref, className, size, variant, ...htmlProps }: CardProps) => {
	const style = React.useMemo(
		() => cn(cardBaseVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...htmlProps} />
}
Card.displayName = 'Card'

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & CardContextProps & { ref?: React.RefObject<HTMLDivElement | null> }

const CardHeader = ({ ref, className, ...props }: CardHeaderProps) => {
	const { size, variant } = props

	const style = React.useMemo(
		() => cn(cardHeaderVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...props} />
}
CardHeader.displayName = 'CardHeader'

export type CardTitleProps = React.HTMLAttributes<HTMLDivElement> & CardContextProps & { ref?: React.RefObject<HTMLDivElement | null> }

const CardTitle = ({ ref, className, ...props }: CardTitleProps) => {
	const { size, variant } = props

	const style = React.useMemo(
		() => cn(cardTitleVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...props} />
}
CardTitle.displayName = 'CardTitle'

export type CardDescriptionProps = React.HTMLAttributes<HTMLDivElement> & CardContextProps & { ref?: React.RefObject<HTMLDivElement | null> }

const CardDescription = ({ ref, className, ...props }: CardDescriptionProps) => {
	const { size, variant } = props

	const style = React.useMemo(
		() => cn(cardDescriptionVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...props} />
}
CardDescription.displayName = 'CardDescription'

export type CardContentProps = React.HTMLAttributes<HTMLDivElement> & CardContextProps & { ref?: React.RefObject<HTMLDivElement | null> }

const CardContent = ({ ref, className, ...props }: CardContentProps) => {
	const { size, variant } = props

	const style = React.useMemo(
		() => cn(cardContentVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...props} />
}
CardContent.displayName = 'CardContent'

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement> & CardContextProps & { ref?: React.RefObject<HTMLDivElement | null> }

const CardFooter = ({ ref, className, ...props }: CardFooterProps) => {
	const { size, variant } = props

	const style = React.useMemo(
		() => cn(cardFooterVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...props} />
}
CardFooter.displayName = 'CardFooter'

export {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
}
