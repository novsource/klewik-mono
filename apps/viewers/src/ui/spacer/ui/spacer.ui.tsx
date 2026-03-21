import type { ComponentProps } from 'react'
import type { SpacerStylesProps } from '../styles/spacer-variants'
import { useMemo } from 'react'
import { cn } from '~utils/cn'
import { spacerVariants } from '../styles/spacer-variants'

type SpacerProps = SpacerStylesProps & ComponentProps<'span'> & {
	space?: number
	units?: number
}

export const Spacer = (props: SpacerProps) => {
	const {
		space = 0,
		units = 4,
		orientation = 'horizontal',
		className,
		...restProps
	} = props

	const styleClassName = useMemo(() => cn(spacerVariants({ orientation }), className), [orientation, className])

	const styles = useMemo(() => {
		if (orientation === 'horizontal')
			return { marginTop: units * space, marginBottom: units * space }

		return { marginLeft: units * space, marginRight: units * space }
	}, [space, units, orientation])

	return (
		<span
			className={styleClassName}
			style={styles}
			{...restProps}
		/>
	)
}
