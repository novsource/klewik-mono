import type { SVGProps } from 'react'

import { cn } from '~shared/utils'

type Sizes = 'xs' | 'sm' | 'default' | 'lg'
type IconsProps = SVGProps<SVGSVGElement> & {
  size?: Sizes
  spinnerClassname?: string
  spinnerBackClassname?: string
}
const sizes: Record<Sizes, number> = {
  xs: 16,
  sm: 18,
  default: 21,
  lg: 24,
}
const SvgLoading = ({ spinnerBackClassname, spinnerClassname, ...props }: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes.default,
    height: props.size ? sizes[props.size] : props.height ?? sizes.default,
    className: cn('animate-spin', props.className),
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path className={cn('stroke-green-light', spinnerBackClassname)} stroke="currentColor" strokeWidth={2.5} d="M12 3.25c1.514 0 3.742.565 5.565 1.955C19.338 6.557 20.75 8.7 20.75 12A8.75 8.75 0 1 1 12 3.25Z" />
      <path className={cn('stroke-green-accent', spinnerClassname)} stroke="#A5A5A5" strokeLinecap="round" strokeWidth={2.5} d="M20.779 12.07c0-6.693-5.603-8.778-8.779-8.778" />
    </svg>
  )
}
export default SvgLoading
