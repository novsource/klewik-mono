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
const SvgCrown = (props: IconsProps) => {
	props = {
		...props,
		width: props.size ? sizes[props.size] : props.width ?? sizes.default,
		height: props.size ? sizes[props.size] : props.height ?? sizes.default,
	}
	return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 25 25" {...props}><path fill="currentColor" d="m21.859 14.536.23-2.435c.18-1.913.27-2.87-.058-3.265a1 1 0 0 0-.675-.367c-.476-.042-1.073.638-2.268 1.998-.618.704-.927 1.055-1.271 1.11-.191.03-.386 0-.562-.09-.319-.16-.53-.595-.955-1.464l-2.237-4.584c-.802-1.643-1.203-2.465-1.813-2.465s-1.011.822-1.813 2.465L8.2 10.023c-.424.87-.636 1.304-.955 1.464a.92.92 0 0 1-.562.09c-.344-.055-.653-.406-1.271-1.11-1.195-1.36-1.792-2.04-2.268-1.998a1 1 0 0 0-.675.367c-.327.396-.237 1.352-.057 3.265l.229 2.435c.378 4.012.566 6.019 1.75 7.229 1.182 1.21 2.954 1.21 6.5 1.21h2.719c3.545 0 5.317 0 6.5-1.21s1.371-3.217 1.749-7.23" /></svg>
}
export default SvgCrown
