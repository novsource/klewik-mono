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
const SvgSlots = (props: IconsProps) => {
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
      <defs>
        <filter
          id="create-slot-filter"
          x="-4.5"
          y="-1.37402"
          width="33"
          height="30.748"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1424_1791"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1424_1791"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_1424_1791"
          x1="7.28138"
          y1="10.3863"
          x2="8.16539"
          y2="5.44094"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1D976C" stopOpacity="0.8" />
          <stop offset="1" stopColor="#93F9B9" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1424_1791"
          x1="8.44201"
          y1="5.71122"
          x2="9.59988"
          y2="0.866722"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1D976C" stopOpacity="0.8" />
          <stop offset="1" stopColor="#93F9B9" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_1424_1791"
          x1="17.8603"
          y1="12.2335"
          x2="12.4243"
          y2="25.1141"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1D976C" stopOpacity="0.8" />
          <stop offset="1" stopColor="#93F9B9" />
        </linearGradient>
      </defs>
      <g filter="url(#create-slot-filter)">
        <path
          fill={
            !props.gradient ? 'currentColor' : 'url(#paint0_linear_1424_1791)'
          }
          d="M20.272 10.465H3.598V9.313a2 2 0 0 1 2-2h12.674a2 2 0 0 1 2 2zM18.192 5.79H5.678V4.626a2 2 0 0 1 2-2h8.514a2 2 0 0 1 2 2z"
        />
        <path
          fill={
            !props.gradient ? 'currentColor' : 'url(#paint2_linear_1424_1791)'
          }
          fillRule="evenodd"
          d="M1.5 14a2 2 0 0 1 2-2h17a2 2 0 0 1 2 2v3.374a4 4 0 0 1-4 4h-13a4 4 0 0 1-4-4zm3.498 1.163c0-.47.38-.85.85-.85h12.35a.85.85 0 1 1 0 1.7H5.847a.85.85 0 0 1-.85-.85m.876 2.03a.85.85 0 0 0 0 1.7h8.274a.85.85 0 1 0 0-1.7z"
          clipRule="evenodd"
        />
      </g>
    </svg>
  )
}
export default SvgSlots
