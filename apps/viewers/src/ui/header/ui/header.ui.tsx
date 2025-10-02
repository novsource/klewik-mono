import type { ComponentProps } from 'react'
import { cn } from '~utils/cn'

export type HeaderProps = ComponentProps<'header'>

export const Header = (props: HeaderProps) => {
	const { children, className, ...restProps } = props

	return (
		<header className={cn('z-10 container h-fit w-full', className)} {...restProps}>
			{children}
		</header>
	)
}
