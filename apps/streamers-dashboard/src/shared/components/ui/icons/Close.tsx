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
const SvgClose = (props: IconsProps) => {
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
      viewBox="0 0 25 24"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m17.038 7.757-8.486 8.486m8.486 0L8.552 7.757"
      />
    </svg>
  )
}
export default SvgClose
