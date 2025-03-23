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
const SvgMinus = ({ strokeWidth, ...props }: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : (props.width ?? sizes['default']),
    height: props.size ? sizes[props.size] : (props.height ?? sizes['default']),
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 24 25"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M18.75 12.356a.75.75 0 0 1-.75.75H6a.75.75 0 0 1 0-1.5h12a.75.75 0 0 1 .75.75"
        clipRule="evenodd"
        stroke="currentColor"
        strokeWidth={strokeWidth ?? 0.15}
      />
    </svg>
  )
}
export default SvgMinus
