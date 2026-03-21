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
const SvgTwitchLogo = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes.default,
    height: props.size ? sizes[props.size] : props.height ?? sizes.default,
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 28 28" {...props}>
      <path fill="#fff" d="m24 13-4 4h-4l-3.5 3.5V17H8V2h16z" />
      <path fill="#9146FF" d="M7 0 2 5v18h6v5l5-5h4l9-9V0zm17 13-4 4h-4l-3.5 3.5V17H8V2h16z" />
      <path fill="#9146FF" d="M21 5.5h-2v6h2zM15.5 5.5h-2v6h2z" />
    </svg>
  )
}
export default SvgTwitchLogo
