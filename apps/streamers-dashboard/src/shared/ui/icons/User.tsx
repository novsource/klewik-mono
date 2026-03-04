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
const SvgUser = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes.default,
    height: props.size ? sizes[props.size] : props.height ?? sizes.default,
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}>
      <circle cx={12} cy={6.889} r={4} fill="currentColor" />
      <ellipse cx={12} cy={17.889} fill="currentColor" rx={7} ry={4} />
    </svg>
  )
}
export default SvgUser
