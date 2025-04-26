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
const SvgMoney = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 25 25" {...props}><path fill="currentColor" d="M4.379 7.768c-.551.55-.757 1.31-.834 2.496a3.375 3.375 0 0 0 3.329-3.33c-1.186.078-1.946.283-2.496.834zM20.621 7.768c-.549-.55-1.31-.756-2.495-.833a3.375 3.375 0 0 0 3.33 3.329c-.078-1.186-.284-1.946-.834-2.496zM20.621 18.01c-.549.55-1.31.756-2.495.833a3.375 3.375 0 0 1 3.33-3.329c-.078 1.186-.284 1.946-.834 2.496zM4.379 18.01c.549.55 1.31.756 2.495.833a3.375 3.375 0 0 0-3.33-3.329c.078 1.186.284 1.946.834 2.496z" /><path fill="currentColor" fillRule="evenodd" d="M3.5 12.514a5.625 5.625 0 0 0 5.625-5.625h6.75a5.625 5.625 0 0 0 5.625 5.624v.75a5.625 5.625 0 0 0-5.625 5.625h-6.75A5.625 5.625 0 0 0 3.5 13.263zm9 1.875a1.5 1.5 0 1 0 0-3.001 1.5 1.5 0 0 0 0 2.999z" clipRule="evenodd" /></svg>;
};
export default SvgMoney;