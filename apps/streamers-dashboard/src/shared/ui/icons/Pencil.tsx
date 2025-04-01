import type { SVGProps } from 'react'

type Sizes = 'xs' | 'sm' | 'default' | 'lg'
type IconsProps = SVGProps<SVGSVGElement> & {
  size?: Sizes
  gradient?: boolean
}
const sizes: Record<Sizes, number> = {
  xs: 16,
  sm: 18,
  default: 21,
  lg: 24,
}
const SvgPencil = (props: IconsProps) => {
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
      viewBox="0 0 24 24"
      {...props}
    >
      <g filter="url(#filter0_d_1432_2575)">
        <path
          fill={
            props.gradient ? 'url(#paint0_linear_1432_2575)' : 'currentColor'
          }
          d="m11.4 18.161 7.396-7.396a10.3 10.3 0 0 1-3.326-2.234 10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114M20.848 8.713a3.932 3.932 0 0 0-5.561-5.561l-.887.887.038.111a8.75 8.75 0 0 0 2.092 3.32 8.75 8.75 0 0 0 3.431 2.13z"
        />
      </g>

      <defs>
        <filter
          id="filter0_d_1432_2575"
          x="-3.75"
          y="-1.75"
          width="29.5"
          height="29.5"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1432_2575"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1432_2575"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1432_2575"
          x1="2.25"
          y1="11"
          x2="19.75"
          y2="11"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#ADA996" />
          <stop offset="0.333333" stop-color="#F2F2F2" />
          <stop offset="0.666667" stop-color="#DBDBDB" />
          <stop offset="1" stop-color="#EAEAEA" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1432_2575"
          x1="2.25"
          y1="11"
          x2="19.75"
          y2="11"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#ADA996" />
          <stop offset="0.333333" stop-color="#F2F2F2" />
          <stop offset="0.666667" stop-color="#DBDBDB" />
          <stop offset="1" stop-color="#EAEAEA" />
        </linearGradient>
      </defs>
    </svg>
  )
}
export default SvgPencil
