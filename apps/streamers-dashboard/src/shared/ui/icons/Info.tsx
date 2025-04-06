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
const SvgInfo = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 25" {...props}><path fill="currentColor" fillRule="evenodd" d="M12 22.013c-4.714 0-7.071 0-8.536-1.465C2 19.084 2 16.727 2 12.013s0-7.071 1.464-8.536C4.93 2.013 7.286 2.013 12 2.013s7.071 0 8.535 1.464C22 4.942 22 7.3 22 12.013s0 7.07-1.465 8.535c-1.464 1.465-3.821 1.465-8.535 1.465m0-4.25a.75.75 0 0 0 .75-.75v-6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75m0-10.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2" clipRule="evenodd" /></svg>;
};
export default SvgInfo;