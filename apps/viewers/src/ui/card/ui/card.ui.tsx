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

const Card = ({ ref, className, size, variant, ...htmlProps }: React.ComponentProps<'div'> & CardStyleProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
	const style = React.useMemo(
		() => cn(cardBaseVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...htmlProps} />
}
Card.displayName = 'Card'

const CardHeader = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & CardContextProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
	const { size, variant } = props

	const style = React.useMemo(
		() => cn(cardHeaderVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...props} />
}
CardHeader.displayName = 'CardHeader'

const CardTitle = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & CardContextProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
	const { size, variant } = props

	const style = React.useMemo(
		() => cn(cardTitleVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...props} />
}
CardTitle.displayName = 'CardTitle'

const CardDescription = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & CardContextProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
	const { size, variant } = props

	const style = React.useMemo(
		() => cn(cardDescriptionVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...props} />
}
CardDescription.displayName = 'CardDescription'

const CardContent = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & CardContextProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
	const { size, variant } = props

	const style = React.useMemo(
		() => cn(cardContentVariants({ size, variant }), className),
		[className, size, variant],
	)

	return <div ref={ref} className={style} {...props} />
}
CardContent.displayName = 'CardContent'

const CardFooter = ({ ref, className, ...props }: React.HTMLAttributes<HTMLDivElement> & CardContextProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
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
