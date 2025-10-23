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
				orientation === 'horizontal' && 'border-t-1 w-full border-b-0',
				orientation === 'vertical' && 'border-r-1 h-3/5 border-l-0',
				className,
			)}
			{...restProps}
		/>
	)
}
