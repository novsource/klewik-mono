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
const SvgCoin = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes.default,
    height: props.size ? sizes[props.size] : props.height ?? sizes.default,
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}>
      <path fill="currentColor" fillRule="evenodd" d="M12 22.356c5.523 0 10-4.478 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10m0-2.392a7.61 7.61 0 1 0 0-15.217 7.61 7.61 0 0 0 0 15.217" clipRule="evenodd" />
      <path fill="currentColor" fillRule="evenodd" d="M12 19.108a6.752 6.752 0 1 0 0-13.504 6.752 6.752 0 0 0 0 13.503zm3.136-6.63a2.132 2.132 0 0 1-3.015 3.015.173.173 0 0 0-.243 0 2.132 2.132 0 0 1-3.015-3.015.173.173 0 0 0 0-.244 2.132 2.132 0 0 1 3.015-3.015.173.173 0 0 0 .244 0 2.132 2.132 0 0 1 3.016 3.014.173.173 0 0 0 0 .244z" clipRule="evenodd" />
    </svg>
  )
}
export default SvgCoin
