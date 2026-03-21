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
const SvgDonationCode = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes.default,
    height: props.size ? sizes[props.size] : props.height ?? sizes.default,
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        strokeWidth={1}
        stroke="currentColor"
        fill="currentColor"
        fillRule="evenodd"
        d="M10.723 3.2a.75.75 0 1 0-1.446-.4L7.763 8.25H4a.75.75 0 1 0 0 1.5h3.347l-1.528 5.5H2a.75.75 0 0 0 0 1.5h3.402L4.277 20.8a.75.75 0 0 0 1.446.4l1.236-4.45h7.443l-1.125 4.05a.75.75 0 0 0 1.446.4l1.236-4.45H20a.75.75 0 1 0 0-1.5h-3.624l1.527-5.5H22a.75.75 0 0 0 0-1.5h-3.68l1.403-5.05a.75.75 0 1 0-1.446-.4l-1.514 5.45H9.32zm4.096 12.05 1.528-5.5H8.903l-1.527 5.5z"
        clipRule="evenodd"
      />
    </svg>
  )
}
export default SvgDonationCode
