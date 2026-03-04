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
const SvgSortAlphabetAsc = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes.default,
    height: props.size ? sizes[props.size] : props.height ?? sizes.default,
  }
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" fillRule="evenodd" d="M2.25 7.327a.75.75 0 0 1 .75-.75h10a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75m14.25-.75a.75.75 0 0 1 .684.443l4.5 10a.75.75 0 1 1-1.368.615l-1.437-3.194H14.12l-1.436 3.195a.75.75 0 1 1-1.368-.615l4.5-10a.75.75 0 0 1 .684-.443zm-1.704 6.364h3.408L16.5 9.156zM2.25 12.33a.75.75 0 0 1 .75-.75h7a.75.75 0 1 1 0 1.5H3a.75.75 0 0 1-.75-.75m0 5a.75.75 0 0 1 .75-.75h5a.75.75 0 1 1 0 1.5H3a.75.75 0 0 1-.75-.75" clipRule="evenodd" /></svg>
}
export default SvgSortAlphabetAsc
