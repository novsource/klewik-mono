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
const SvgMagnifier = (props: IconsProps) => {
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
      viewBox="0 0 24 24"
      {...props}
    >
      <g clipPath="url(#Magnifier_svg__a)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          stroke="currentColor"
          strokeLinecap="round"
          d="M11.5 2.75a8.75 8.75 0 1 0 0 17.5 8.75 8.75 0 0 0 0-17.5ZM1.25 11.5c0-5.66 4.59-10.25 10.25-10.25S21.75 5.84 21.75 11.5c0 2.56-.939 4.902-2.491 6.698l3.271 3.272a.75.75 0 0 1-1.06 1.06l-3.272-3.271A10.2 10.2 0 0 1 11.5 21.75c-5.66 0-10.25-4.589-10.25-10.25Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="Magnifier_svg__a">
          <path fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
export default SvgMagnifier
