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
const SvgWheel = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" d="M6.222 4.929a9.5 9.5 0 0 1 1.395-.772c1.372-.614 2.058-.921 2.97-.33s.913 1.56.913 3.5v1.5c0 1.886 0 2.829.586 3.415s1.528.585 3.414.585H17c1.94 0 2.91 0 3.5.913.592.912.285 1.598-.33 2.97a9.5 9.5 0 0 1-5.035 4.894A9.5 9.5 0 0 1 6.223 4.93" /><path fill="currentColor" d="M21.446 7.396a8.03 8.03 0 0 0-4.515-4.515C15.389 2.274 14 3.671 14 5.327v4a1 1 0 0 0 1 1h4c1.657 0 3.053-1.389 2.446-2.93" /></svg>;
};
export default SvgWheel;