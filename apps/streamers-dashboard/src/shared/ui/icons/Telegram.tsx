import * as React from 'react'
import type { SVGProps } from 'react'

type Sizes = 'xs' | 'sm' | 'default' | 'lg'
type IconsProps = SVGProps<SVGSVGElement> & {
  size: Sizes
}
const sizes: Record<Sizes, number> = {
  xs: 16,
  sm: 18,
  default: 21,
  lg: 24,
}
const SvgTelegram = (props: IconsProps) => {
  props = {
    ...props,
    width: sizes[props.size] ?? props.width ?? sizes['default'],
    height: sizes[props.size] ?? props.height ?? sizes['default'],
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 28 28"
      {...props}
    >
      <path
        fill="currentColor"
        d="M23.983 6.761c.156-1.007-.801-1.802-1.697-1.409l-17.83 7.83c-.642.28-.595 1.253.07 1.465l3.678 1.171a2.37 2.37 0 0 0 2.074-.315l8.29-5.728c.25-.172.523.183.31.403l-5.968 6.153c-.579.597-.464 1.608.232 2.045l6.682 4.19c.75.47 1.713-.003 1.853-.908z"
      />
    </svg>
  )
}
export default SvgTelegram
