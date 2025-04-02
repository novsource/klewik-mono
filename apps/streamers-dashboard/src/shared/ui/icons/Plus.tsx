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
const SvgPlus = ({ strokeWidth, gradient = false, ...props }: IconsProps) => {
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
      <g filter="url(#filter0_d_1472_1024)">
        <path
          fill={gradient ? 'url(#paint0_linear_1472_1024)' : 'currentColor'}
          fillRule="evenodd"
          d="M12.75 6.327a.75.75 0 0 0-1.5 0v5.25H6a.75.75 0 1 0 0 1.5h5.25v5.25a.75.75 0 0 0 1.5 0v-5.25H18a.75.75 0 0 0 0-1.5h-5.25z"
          clipRule="evenodd"
          stroke={gradient ? 'url(#paint0_linear_1472_1024)' : 'currentColor'}
          strokeWidth={strokeWidth ?? 0.15}
        />
      </g>
      f
      <defs>
        <filter
          id="filter0_d_1472_1024"
          x="0.404297"
          y="-1.64844"
          width={props.width}
          height={props.height}
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
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1472_1024"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1472_1024"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1472_1024"
          x1="7.95194"
          y1="2.35156"
          x2="7.95194"
          y2="9.44697"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#1D976C" />
          <stop offset="1" stop-color="#93F9B9" />
        </linearGradient>
      </defs>
    </svg>
  )
}
export default SvgPlus
