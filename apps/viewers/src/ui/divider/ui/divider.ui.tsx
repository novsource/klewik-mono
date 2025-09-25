import type { ComponentPropsWithRef } from 'react'
import { cn } from '~utils/cn'

export type DividerProps = ComponentPropsWithRef<'hr'> & {
	orientation?: 'horizontal' | 'vertical'
}

export const Divider = (props: DividerProps) => {
	const { className, orientation = 'horizontal', ...restProps } = props

	return (
		<hr
			className={cn(
				'border-dark-accent',
				orientation === 'horizontal' && 'tablet:border-t-1 w-full border-b-0',
				orientation === 'vertical' && 'tablet:border-r-1 h-2/3 border-l-0',
				className,
			)}
			{...restProps}
		/>
	)
}
