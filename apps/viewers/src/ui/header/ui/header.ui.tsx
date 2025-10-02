import type { ComponentProps } from 'react'
import Image from 'next/image'
import { cn } from '~utils/cn'

const Header = (props: ComponentProps<'header'>) => {
	const { children, className, ...restProps } = props

	return (
		<header className={cn('z-10 container h-fit w-full', className)} {...restProps}>
			<div className="h-full w-full pt-2">
				<div className="border-gray/20 rounded-medium bg-dark/30 relative z-20 flex h-full w-full items-center justify-between gap-x-4 border-1 px-4 py-3 backdrop-blur-md">
					<Image
						alt="Logo"
						src="/logo.svg"
						className="text-green-accent"
						width={21}
						height={21}
						priority
					/>
					{children}
				</div>
			</div>
		</header>
	)
}

export default Header
