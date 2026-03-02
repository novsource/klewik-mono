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
const SvgTuning = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes.default,
    height: props.size ? sizes[props.size] : props.height ?? sizes.default,
  }
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M9.25 14a3 3 0 1 1 0 6 3 3 0 0 1 0-6M14.25 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6M8.75 6.209a.75.75 0 0 1 0 1.499l-7-.001a.75.75 0 0 1 0-1.501h7zM14.75 16.208a.75.75 0 0 0 0 1.5h7a.75.75 0 0 0 0-1.5zM1 16.958a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75M21.75 6.209a.75.75 0 0 1 0 1.499l-2-.001a.75.75 0 0 1 0-1.501h2z" /></svg>
}
export default SvgTuning
