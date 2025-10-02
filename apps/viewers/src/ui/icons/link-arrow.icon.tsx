import type { SVGProps } from 'react'
import * as React from 'react'

type Sizes = 'xs' | 'sm' | 'default' | 'lg'
type IconsProps = SVGProps<SVGSVGElement> & {
	size?: Sizes
}
const sizes: Record<Sizes, number> = {
	xs: 16,
	sm: 18,
	default: 21,
	lg: 24,
}
const SvgLinkArrow = (props: IconsProps) => {
	props = {
		...props,
		width: props.size ? sizes[props.size] : props.width ?? sizes.default,
		height: props.size ? sizes[props.size] : props.height ?? sizes.default,
	}
	return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M9 6.75a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-1.5 0V7.81L6.53 18.53a.75.75 0 0 1-1.06-1.06L16.19 6.75z" clipRule="evenodd" /></svg>
}
export default SvgLinkArrow
