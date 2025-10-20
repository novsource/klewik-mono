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
const SvgMoneyHand = ({ gradient, ...props }: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : (props.width ?? sizes.default),
    height: props.size ? sizes[props.size] : (props.height ?? sizes.default),
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 26 26"
      {...props}
    >
      <path
        d="M6.78225 21.4686H6.50065C5.47927 21.4686 4.96859 21.4686 4.65129 21.1513C4.33398 20.834 4.33398 20.3233 4.33398 19.3019V18.0973C4.33398 17.5356 4.33398 17.2548 4.47826 17.0039C4.62254 16.7531 4.8402 16.6265 5.27551 16.3733C8.14144 14.7065 12.2115 13.7682 14.928 15.3884C15.1105 15.4973 15.2746 15.6287 15.4149 15.7862C16.0195 16.4653 15.9754 17.4903 15.2786 18.0985C15.1315 18.2269 14.9746 18.3243 14.8167 18.3581C14.9465 18.3431 15.0709 18.3259 15.1896 18.3069C16.177 18.1494 17.0058 17.6218 17.7645 17.0486L19.7223 15.5697C20.4125 15.0483 21.4369 15.0482 22.1272 15.5695C22.7487 16.0387 22.9387 16.8114 22.5458 17.4412C22.0876 18.1756 21.4421 19.1152 20.8222 19.6893C20.2015 20.2642 19.2774 20.7774 18.5229 21.1416C17.6872 21.545 16.7639 21.7774 15.8248 21.9294C13.9202 22.2377 11.9353 22.1907 10.05 21.8023C8.98423 21.5827 7.87734 21.4686 6.78225 21.4686Z"
        fill={gradient ? 'url(#paint0_linear_1845_2575)' : 'currentColor'}
      />
      <path
        d="M7.1346 2.80159C6.73726 3.19894 6.58871 3.7479 6.53316 4.60427C7.85303 4.58667 8.91968 3.52003 8.93728 2.20016C8.08091 2.2557 7.53194 2.40425 7.1346 2.80159Z"
        fill={gradient ? 'url(#paint1_linear_1845_2575)' : 'currentColor'}
      />
      <path
        d="M18.8654 2.80159C18.4681 2.40425 17.9191 2.25569 17.0627 2.20015C17.0803 3.52003 18.147 4.58667 19.4668 4.60427C19.4113 3.7479 19.2627 3.19893 18.8654 2.80159Z"
        fill={gradient ? 'url(#paint2_linear_1845_2575)' : 'currentColor'}
      />
      <path
        d="M18.8654 10.1991C18.4681 10.5964 17.9191 10.745 17.0627 10.8005C17.0803 9.48062 18.147 8.41398 19.4668 8.39638C19.4113 9.25275 19.2627 9.80172 18.8654 10.1991Z"
        fill={gradient ? 'url(#paint3_linear_1845_2575)' : 'currentColor'}
      />
      <path
        d="M7.1346 10.1991C7.53194 10.5964 8.08091 10.745 8.93728 10.8005C8.91968 9.48062 7.85303 8.41398 6.53316 8.39638C6.58871 9.25275 6.73726 9.80172 7.1346 10.1991Z"
        fill={gradient ? 'url(#paint4_linear_1845_2575)' : 'currentColor'}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 6.22949C8.74366 6.22949 10.5625 4.41065 10.5625 2.16699H15.4375C15.4375 4.41065 17.2563 6.22949 19.5 6.22949V6.77116C17.2563 6.77116 15.4375 8.59 15.4375 10.8337H10.5625C10.5625 8.59 8.74366 6.77116 6.5 6.77116V6.22949ZM13 7.58366C13.5983 7.58366 14.0833 7.09863 14.0833 6.50033C14.0833 5.90202 13.5983 5.41699 13 5.41699C12.4017 5.41699 11.9167 5.90202 11.9167 6.50033C11.9167 7.09863 12.4017 7.58366 13 7.58366Z"
        fill={gradient ? 'url(#paint5_linear_1845_2575)' : 'currentColor'}
      />
      <defs>
        <linearGradient id="paint0_linear_1845_2575" x1="11" y1="20.6963" x2="23.75" y2="20.6963" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0EAFC" />
          <stop offset="1" stopColor="#CFDEF3" />
        </linearGradient>
        <linearGradient id="paint1_linear_1845_2575" x1="12.5" y1="12.5" x2="21.5" y2="12.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0EAFC" />
          <stop offset="1" stopColor="#CFDEF3" />
        </linearGradient>
        <linearGradient id="paint2_linear_1845_2575" x1="12.5" y1="12.5" x2="21.5" y2="12.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0EAFC" />
          <stop offset="1" stopColor="#CFDEF3" />
        </linearGradient>
        <linearGradient id="paint3_linear_1845_2575" x1="12.5" y1="12.5" x2="21.5" y2="12.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0EAFC" />
          <stop offset="1" stopColor="#CFDEF3" />
        </linearGradient>
        <linearGradient id="paint4_linear_1845_2575" x1="12.5" y1="12.5" x2="21.5" y2="12.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0EAFC" />
          <stop offset="1" stopColor="#CFDEF3" />
        </linearGradient>
        <linearGradient id="paint5_linear_1845_2575" x1="12.5" y1="12.5" x2="21.5" y2="12.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0EAFC" />
          <stop offset="1" stopColor="#CFDEF3" />
        </linearGradient>
      </defs>
    </svg>
  )
}
export default SvgMoneyHand
