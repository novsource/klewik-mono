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
const SvgEyeClosed = (props: IconsProps) => {
  props = {
    ...props,
    width: props.size ? sizes[props.size] : props.width ?? sizes['default'],
    height: props.size ? sizes[props.size] : props.height ?? sizes['default']
  };
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394-.001-.001h-.001l.002.009.021.045q.029.064.094.194c.086.172.219.423.4.728.364.612.917 1.426 1.67 2.238a12 12 0 0 0 .59.591C7.179 11.801 9.25 13 11.998 13c1.209 0 2.278-.23 3.22-.602 1.227-.482 2.255-1.209 3.096-1.998a13 13 0 0 0 2.733-3.724l.026-.059.005-.01a1 1 0 0 1 1.84.787L22 7l.92.394-.003.005-.004.007-.011.026a10 10 0 0 1-.19.395 15.4 15.4 0 0 1-2.302 3.297l.798.797a1 1 0 0 1-1.414 1.414l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.203a1 1 0 1 1-1.676 1.09l-.986-1.514c-.679.21-1.404.357-2.176.426V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.515a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.256l-.84.84a1 1 0 0 1-1.414-1.414l.797-.798a15.4 15.4 0 0 1-1.871-2.52 14 14 0 0 1-.592-1.107l-.033-.072-.01-.02-.002-.008-.001-.002v-.001S1.08 7.394 2 7l-.919.395a1 1 0 0 1 .526-1.314z" clipRule="evenodd" /></svg>;
};
export default SvgEyeClosed;