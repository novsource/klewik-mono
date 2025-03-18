import * as React from "react";
import type { SVGProps } from "react";
type Sizes = 'xs' | 'sm' | 'default' | 'lg';
type IconsProps = SVGProps<SVGSVGElement> & {
  size?: Sizes;
};
const sizes: Record<Sizes, number> = {
  xs: 16,
  sm: 18,
  default: 21,
  lg: 24
};
const SvgPointsSum = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" fillRule="evenodd" d="M6.75 22.09a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5m0-1.256a3.994 3.994 0 1 0 0-7.989 3.994 3.994 0 0 0 0 7.99" clipRule="evenodd" /><path fill="currentColor" fillRule="evenodd" d="M6.75 20.384a3.545 3.545 0 1 0 0-7.09 3.545 3.545 0 0 0 0 7.09m1.646-3.48a1.12 1.12 0 0 1-1.582 1.583.09.09 0 0 0-.129 0 1.12 1.12 0 0 1-1.582-1.583.09.09 0 0 0 0-.128 1.12 1.12 0 1 1 1.582-1.583.09.09 0 0 0 .129 0 1.12 1.12 0 1 1 1.582 1.583.09.09 0 0 0 0 .128M17.25 22.09a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5m0-1.256a3.994 3.994 0 1 0 0-7.989 3.994 3.994 0 0 0 0 7.99" clipRule="evenodd" /><path fill="currentColor" fillRule="evenodd" d="M17.25 20.384a3.545 3.545 0 1 0 0-7.09 3.545 3.545 0 0 0 0 7.09m1.646-3.48a1.12 1.12 0 0 1-1.582 1.583.09.09 0 0 0-.129 0 1.12 1.12 0 0 1-1.582-1.583.09.09 0 0 0 0-.128 1.12 1.12 0 0 1 1.582-1.583.09.09 0 0 0 .129 0 1.119 1.119 0 1 1 1.582 1.583.09.09 0 0 0 0 .128M12 13.065a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5m0-1.255a3.994 3.994 0 1 0 0-7.989 3.994 3.994 0 0 0 0 7.989" clipRule="evenodd" /><path fill="currentColor" fillRule="evenodd" d="M12 11.36a3.545 3.545 0 1 0 0-7.09 3.545 3.545 0 0 0 0 7.09m1.646-3.48a1.12 1.12 0 0 1-1.583 1.582.09.09 0 0 0-.128 0 1.12 1.12 0 0 1-1.583-1.582.09.09 0 0 0 0-.129 1.12 1.12 0 0 1 1.583-1.582.09.09 0 0 0 .128 0 1.119 1.119 0 1 1 1.583 1.582.09.09 0 0 0 0 .129" clipRule="evenodd" /></svg>;
};
export default SvgPointsSum;