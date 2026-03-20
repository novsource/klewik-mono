import type { SVGProps } from 'react'

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
const SvgKey = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes.default,
    height: props.size ? sizes[props.size] : props.height ?? sizes.default,
  }
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M18.977 14.79a6.907 6.907 0 1 0-11.573-3.159c.095.37.01.77-.258 1.038L3.433 16.38a1.48 1.48 0 0 0-.424 1.21l.231 2.09c.026.222.126.43.284.588l.208.208a1 1 0 0 0 .59.283l2.088.23a1.48 1.48 0 0 0 1.21-.424l.71-.71-1.747-1.727a.75.75 0 1 1 1.055-1.067l1.752 1.733 1.942-1.942c.27-.27.668-.353 1.037-.258a6.9 6.9 0 0 0 6.607-1.806zm-6.391-6.204a2 2 0 1 1 2.828 2.828 2 2 0 0 1-2.828-2.828" clipRule="evenodd" /></svg>
}
export default SvgKey
