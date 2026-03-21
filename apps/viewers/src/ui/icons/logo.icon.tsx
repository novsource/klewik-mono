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
const SvgLogo = (props: IconsProps) => {
	props = {
		...props,
		width: props.size ? sizes[props.size] : (props.width ?? sizes.default),
		height: props.size ? sizes[props.size] : (props.height ?? sizes.default),
	}
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			fill="none"
			viewBox="0 0 32 33"
			{...props}
		>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="m9.431 14.751 1.06.001a3.5 3.5 0 0 1 3.423 2.783v-2.29a2.268 2.268 0 0 0-4.482-.492zm4.433 3.499a2.268 2.268 0 0 1-4.435-.001l4.435-.001zm-5.631-3.007a3.414 3.414 0 1 1 6.827 0v2.528a3.414 3.414 0 1 1-6.828.001v-2.528zm14.845 3.006a2.268 2.268 0 0 1-4.434-.001l4.434-.001zm.05-.571V15.24a2.268 2.268 0 0 0-4.481-.49h1.03a3.5 3.5 0 0 1 3.452 2.927zm-5.68-2.438a3.414 3.414 0 1 1 6.827 0v2.53a3.414 3.414 0 1 1-6.828 0v-2.53zM4.323 16.955a7.934 7.934 0 1 0 11.221 11.22.643.643 0 0 1 .91 0 7.935 7.935 0 0 0 11.221-11.22.643.643 0 0 1 0-.91 7.935 7.935 0 0 0-11.221-11.22.643.643 0 0 1-.91 0 7.934 7.934 0 1 0-11.22 11.22.643.643 0 0 1 0 .91z"
				clipRule="evenodd"
			/>
		</svg>
	)
}
export default SvgLogo
