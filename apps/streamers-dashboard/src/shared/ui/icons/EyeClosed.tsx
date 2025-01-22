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
  return <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}><path fill="currentColor" fillRule="evenodd" d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009.021.045q.03.065.094.195c.086.172.219.423.4.728.364.612.917 1.426 1.67 2.238a12 12 0 0 0 .59.591C7.18 11.801 9.251 13 12 13c1.209 0 2.278-.23 3.22-.602 1.227-.482 2.254-1.209 3.096-1.998a13 13 0 0 0 2.733-3.724l.027-.059.005-.01a1 1 0 0 1 1.838.787L22 7l.92.394-.003.005-.004.008-.011.026-.04.088a14.045 14.045 0 0 1-.741 1.348 15.4 15.4 0 0 1-1.711 2.255l.797.798a1 1 0 0 1-1.414 1.414l-.84-.84c-.565.455-1.196.885-1.897 1.256l.782 1.203a1 1 0 1 1-1.676 1.09l-.986-1.514c-.679.208-1.404.355-2.176.425V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.256l-.84.84a1 1 0 0 1-1.414-1.414l.797-.798A15.4 15.4 0 0 1 1.72 8.605a14 14 0 0 1-.591-1.107l-.033-.072-.01-.02-.002-.008-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314" clipRule="evenodd" /></svg>;
};
export default SvgEyeClosed;