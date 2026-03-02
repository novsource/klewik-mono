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
const SvgOpenArrow = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes.default,
    height: props.size ? sizes[props.size] : props.height ?? sizes.default,
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}>
      <path fill="currentColor" d="M12 2.139h-.057c-2.309-.001-4.118-.001-5.53.189-1.444.193-2.584.598-3.479 1.493s-1.3 2.035-1.494 3.48c-.19 1.411-.19 3.22-.19 5.529v.114c0 2.309 0 4.118.19 5.53.194 1.444.6 2.584 1.494 3.479.895.895 2.035 1.3 3.48 1.494 1.411.189 3.22.189 5.529.189h.114c2.309-.001 4.118-.001 5.53-.19 1.444-.195 2.584-.6 3.479-1.495s1.3-2.035 1.494-3.48c.19-1.411.19-3.22.19-5.529v-.057a.75.75 0 0 0-1.5-.001c0 2.377-.002 4.085-.176 5.385-.172 1.279-.5 2.05-1.069 2.62-.57.569-1.34.896-2.619 1.067-1.3.175-3.008.177-5.386.177-2.378-.001-4.086-.003-5.386-.177-1.279-.172-2.05-.5-2.62-1.069-.569-.57-.896-1.34-1.068-2.619-.174-1.3-.176-3.008-.176-5.386 0-2.38.002-4.088.176-5.388.172-1.278.5-2.049 1.069-2.618.57-.57 1.34-.897 2.619-1.069 1.3-.174 3.008-.176 5.386-.176a.75.75 0 0 0 0-1.501z" />
      <path fill="currentColor" d="M12.47 11.359a.75.75 0 1 0 1.06 1.06l7.72-7.72v3.533a.75.75 0 0 0 1.5 0V2.889a.75.75 0 0 0-.75-.751h-5.344a.75.75 0 0 0 0 1.499h3.533l-7.72 7.719z" />
    </svg>
  )
}
export default SvgOpenArrow
