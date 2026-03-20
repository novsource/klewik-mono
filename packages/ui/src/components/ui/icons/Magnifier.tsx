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
const SvgMangifer = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes.default,
    height: props.size ? sizes[props.size] : props.height ?? sizes.default,
  }
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 25 25" {...props}><path fill="currentColor" d="m22 20.563-5.816-5.818a7.52 7.52 0 0 0 1.44-4.433c0-4.17-3.393-7.562-7.562-7.562S2.5 6.142 2.5 10.312s3.392 7.562 7.562 7.562a7.52 7.52 0 0 0 4.433-1.44l5.818 5.816zm-11.938-5.077a5.174 5.174 0 1 1-.001-10.349 5.174 5.174 0 0 1 0 10.349" /></svg>
}
export default SvgMangifer
