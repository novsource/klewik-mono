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
export default function Copy(props: IconsProps) {
	props = {
		...props,
		width: props.size ? sizes[props.size] : props.width ?? sizes.default,
		height: props.size ? sizes[props.size] : props.height ?? sizes.default,
	}
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 25 24" {...props}>
			<path fill="currentColor" d="M15.74 2h-3.894c-1.764 0-3.162 0-4.256.148-1.124.152-2.035.472-2.753 1.192-.719.722-1.038 1.637-1.19 2.767C3.5 7.205 3.5 8.607 3.5 10.38v5.837c0 1.508.92 2.8 2.227 3.342-.067-.91-.067-2.186-.067-3.248v-5.01c0-1.281 0-2.386.118-3.27.127-.948.413-1.856 1.147-2.593.734-.738 1.64-1.025 2.583-1.153.88-.118 1.98-.118 3.257-.118l.095-.001h2.88l.095-.001c1.276-.001 2.374-.001 3.255.117A3.6 3.6 0 0 0 15.74 2" />
			<path fill="currentColor" d="M7.1 11.397c0-2.726 0-4.089.844-4.936.843-.846 2.2-.846 4.916-.846h2.88c2.715 0 4.073 0 4.917.847.843.848.843 2.211.843 4.937v4.82c0 2.726 0 4.09-.843 4.936-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847-.844-.847-.844-2.21-.844-4.936v-4.82z" />
		</svg>
	)
}
